---
title: Well, I'll Just Fix Safari Myself, Then!
repost_link: https://twitter.com/_saagarjha/status/1439686585100865539
---

This absolute madlad reverse-engineered Safari enough to fix a bug himself, wowza

[@\_saagarjha](https://twitter.com/_saagarjha):

> Hey Mac Safari team, I know you're busy getting things ready for Monterey, but can you please fix the bug where Safari crashes when you try to reopen a window that has pinned tabs? I already filed FB9637329, but to make this as easy as possible I've already found the bug for you.

> About halfway down -[BrowserWindowPersistentState initWithBrowserWindowController:encryptionProvider:skipTabStates:] you save the currently selected tab to self->\_selectedUnpinnedTabIndex. The index you calculate includes all the pinned tabs...

<figure>
  <img src="https://static.wolfgirl.dev/cybersec/2021-09-19-1.jfif" width="500" />
</figure>

> ...but at the top of -[BrowserWindowPersistentState restoreWindowContents:] you use this combined index to read from self->\_tabStates, which _doesn't_ include pinned tabs. Sometimes, you'll just end up selecting the wrong tab, but other times the index will be out of bounds...

<figure>
  <img src="https://static.wolfgirl.dev/cybersec/2021-09-19-2.jfif" width="500" />
</figure>

> ...and I'm sure you have enough crash reports for this already to recognize what the consequences of that are. Now, I don't have your code in front of me, but perhaps you can fix this by not adding self.currentPinnedTabStates.count to the index when you save it.
