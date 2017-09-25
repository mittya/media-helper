.PHONY: firefox, chrome

firefox:
	cd firefox && zip -r -X firefox.zip *

chrome:
	cd chrome && zip -r -X chrome.zip *
