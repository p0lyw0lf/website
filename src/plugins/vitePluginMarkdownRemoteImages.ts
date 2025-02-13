export const getMarkdownCodeForImages = (
  remoteImagePaths: string[],
  html: string,
) => {
  return `
			import { getImage } from "astro:assets";

			const images = async function(html) {
					const imageSources = {};
					${remoteImagePaths
            .map((raw) => {
              // TODO: make all these different image collections run concurrently, instead of sequentially like they are currently.
              // Also this whole approach just reeks. Like I get we should do the async work in a separate step from the replacement work,
              // because the replacement needs to run serially, but the whole thing with the `index` property _needing_ to be the
              // exact position within the document is just a bad smell. I think the overall flow should be:
              // 1. Collect all matches
              // 2. Concurrently transform all matches and collect the results
              // 3. Replace all matches with the transformed results.
              const rawUrl = JSON.stringify(raw);
              return `{
											const regex = new RegExp('__ASTRO_IMAGE_="([^"]*' + ${rawUrl.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\\\$&",
                      )} + '[^"]*)"', 'g');
											let match;
											let occurrenceCounter = 0;
											while ((match = regex.exec(html)) !== null) {
													const matchKey = ${rawUrl} + '_' + occurrenceCounter;
													const props = JSON.parse(match[1].replace(/&#x22;/g, '"'));
													imageSources[matchKey] = await getImage(props);
													occurrenceCounter++;
											}
									}`;
            })
            .join("\n")}
					return imageSources;
			};

		async function updateImageReferences(html) {
			const imageSources = await images(html);

			return html.replaceAll(/__ASTRO_IMAGE_="([^"]+)"/gm, (full, imagePath) => {
				const decodedImagePath = JSON.parse(imagePath.replace(/&#x22;/g, '"'));

				// Use the 'index' property for each image occurrence
				const srcKey = decodedImagePath.src + '_' + decodedImagePath.index;

				if (imageSources[srcKey].srcSet && imageSources[srcKey].srcSet.values.length > 0) {
					imageSources[srcKey].attributes.srcset = imageSources[srcKey].srcSet.attribute;
				}

				const { index, ...attributesWithoutIndex } = imageSources[srcKey].attributes;
        ${/* TODO: we might need to create our own implementation of spreadAttributes here? */ ""}
				return spreadAttributes({
					src: imageSources[srcKey].src,
					...attributesWithoutIndex,
				});
			});
		}

		const html = async () => await updateImageReferences(${JSON.stringify(html)});
	`;
};
