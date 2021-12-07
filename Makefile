.PHONY: zip

zip:
	rm -f ~/Downloads/chrome.zip ~/Downloads/edge.zip ~/Downloads/firefox.zip
	cd chrome && zip -r -X ~/Downloads/chrome.zip *
	cd chrome && zip -r -X ~/Downloads/edge.zip *
	cd firefox && zip -r -X ~/Downloads/firefox.zip *
