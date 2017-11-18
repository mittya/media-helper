.PHONY: ff, ch

ff:
	cd firefox && zip -r -X firefox.zip *

ch:
	cd chrome && zip -r -X chrome.zip *
