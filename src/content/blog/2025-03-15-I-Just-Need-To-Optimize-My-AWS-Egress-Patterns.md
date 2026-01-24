---
title: "I Just Need To Optimize My AWS Egress Patterns"
description: "To preface: I\u0027ve been doing pretty well for myself at minimizing my cloud spend. I just have a static site in S3 behind CloudFront, so th..."
tags: ["devops", "aws", "blag"]
published: 1742049667
mastodon: "https://social.treehouse.systems/@PolyWolf/114166967018219509"
bluesky: "at://did:plc:bmuca5i6atczdbccgzeqwcl4/app.bsky.feed.post/3lkge7u3xlk2v"
---

To preface: I've been doing pretty well for myself at minimizing my cloud spend. I just have a static site in S3 behind CloudFront, so the following table accounts for all of my spend[^1]:

| Usage type              | Oct 2024  | Nov 2024  | Dec 2024  | Jan 2025  | Feb 2025  |
| :---------------------- | :-------- | :-------- | :-------- | :-------- | :-------- |
| S3 Requests-Tier1       | $0.03     | $0.02     | $0.02     | $0.07     | $0.10     |
| S3 TimedStorage-ByteHrs | $0.05     | $0.05     | $0.05     | $0.04     | $0.03     |
| S3 Requests-Tier2       | $0.02     | $0.02     | $0.02     | $0.02     | $0.02     |
| **Total costs**         | **$0.10** | **$0.09** | **$0.09** | **$0.12** | **$0.15** |

So clearly, I don't _need_ to optimize my spend with it in the pennies n all, but there's still a worrying trend, and I like optimizing, so optimize I shall.

## What Happened In January?

Looking at CloudWatch metrics for my CloudFront distributions, we see that neither the number of requests nor the number of bytes downloaded lines up with the price increase I'm seeing[^s3][^bots]:

<figure>
<table>
<tbody>
<tr>
<td>

![Requests summed over 7 day periods. Green spikes in October, later November & early December, then tapers off in January and February. Blue is flat for most the rest, with Red and Orange at the very bottom.](<https://static.wolfgirl.dev/polywolf/blog/019599de-a4ef-7665-97df-7b1373ff6cfa/Screenshot 2025-03-15 095227.png>)

</td>
<td>

![Bytes downloaded summed over 7 day periods. Red & Orange spike in December and Feburary, with other smaller spikes still high above Green & Blue.](<https://static.wolfgirl.dev/polywolf/blog/019599de-a4ef-7665-97df-7b1373ff6cfa/Screenshot 2025-03-15 095254.png>)

</td>
</tr>
</tbody>
</table>
<figcaption>Green & Blue are the main sites, and Red & Orange are my static files</figcaption>
</figure>

Instead, what I think is happening is that I started [analyzing my CloudFront access logs](https://wolfgirl.dev/blog/2025-01-19-i-have-numbers-now/). Whoops!

## What's Wrong With The Access Log Egress Pattern?

I have two hypotheses:

1. You're not supposed to put the files from [CloudFront access logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html) into `{yyyy}/{MM}/{dd}` folders, because `LIST` requests are 10x as expensive as `GET` requests, or
2. There isn't a way to use the S3 access logs w/o incurring this cost, because CloudFront just loves to put a bunch of tiny files in ur bucket, and `GET`ing all those files will incur costs.

Unfortunately, I can't really think of any way to solve this that doesn't involve services that are more expensive (Firehose, CloudWatch Logs)[^2] or fetching the files in some other way (AWS Lambda behind API Gateway behind CloudFront) which would still eat most of the same `LIST`/`GET` costs.

## Let's Do Some Math

I have about 15000 objects in my log buckets, across 60 days. I check it about once a day, so looking at the [S3 pricing page](https://aws.amazon.com/s3/pricing/) & accounting for the slightly nested nature of some of the folders, we get:

```
$ python
Python 3.11.11 (main, Dec  3 2024, 17:20:40) [GCC 13.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 15000 * 0.0004 / 1000
0.006
>>> 30 * 65 * 0.005 / 1000
0.00975
```

hrm. That's not right. That should only show up as $0.02 on my bill, and clearly it's more than that, so I'm doing something wrong. Maybe it has to make a `HEAD` request to check if an object's been updated?

```
>>> 30 * 15000 * 0.0004 / 1000
0.18
```

Now that's roughly the same order of magnitude, but now it's _too_ large. Maybe I'm not actually checking my charts every day, but maybe I'm still doing my math wrong... Wait a minute, what about the `PUT` requests CloudFront makes to upload these objects in the first place?

```
>>> 15000 * 0.005 / 1000
0.07
```

Bingo, we have a winner. Doesn't like up perfectly because I accidentally nuked part of it once, but yeah that'd do it, especially when combined with the uploads I do to my blog normally. Welp, nothing much I can do about that, mystery solved! So long as I _actually_ run dashboard creation just once a day (or even more if I got that `LIST` calculation wrong), I think the cost will remain manageable (<$0.20); I've paid a lot more for not understanding the Oracle Cloud "Always Free" tier lol.

Log ingestion is hard!! Still working at it, GoAccess is really nice but still needs a way to get the data. Same with whatever dashboard software I decide to use next[^observable].

[^1]: I host pretty much everything else on an Oracle Cloud Always Free VPS, which is quite beefy, at the expense of having to give Larry Ellison my credit card info & having the threat of the VPS being totally deleted for no reason at any point. Still 100% worth it for me, as you can see, with the rest of my spend in the pennies.

[^2]: At least I'm pretty sure, looking at their pricing pages vs the S3 page and thinking about what my usage pattern looks like. Can't be 100% certain until I actually tried to build things with them, this is a classic AWS-ism :)

[^s3]: I know data out from CloudFront isn't a perfect analogue for S3 data charges, but it's what I have since turns out S3 doesn't enable access metrics by default. I've turned them on for my log buckets now, hopefully this doesn't start charging me something ridiculous...

[^bots]: Every time I look at this chart I'm reminded I should probably put a `robots.txt` file in my static sites so scrapers don't download a bunch of files...

[^observable]: [Observable Framework](https://observablehq.com/framework/) looks pretty nice... i <3 niche SSGs
