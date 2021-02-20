.PHONY: zip

zip:
	zip -r -X chrome.zip chrome/* && \
	zip -r -X firefox.zip firefox/* && \
	zip -r -X edge.zip chrome/*
