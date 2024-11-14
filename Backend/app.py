from flask import Flask, jsonify, request, send_file
from pytube.cli import on_progress
from pytubefix import YouTube
from flask_cors import CORS




app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True


url = ""
formats = []

@app.route("/test")
def test():
    return "Hello World"

@app.route("/videodownloader", methods=["POST"])
def video_downloader():
    global url, formats

    data = request.json
    url = data.get('url')
    print(url)

    try:
        yt = YouTube(url, on_progress_callback=on_progress)
        title = yt.title
        url_image = yt.thumbnail_url
        author = yt.author
        streams = yt.streams
        print(streams)






        formats = []
        for cont, stream in enumerate(streams):
            formats.append({
                "id": cont,
                "url": stream.url,
                    "itag": stream.itag,
                "size": stream.filesize_mb,
                "type": stream.type,
                "extension": stream.subtype,
                "resolution": stream.resolution,
            })

        print(jsonify({"title": title,"author":author, "url_image": url_image, "formats": formats}))
        return jsonify({"title": title,"author":author, "url_image": url_image, "formats": formats})


    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/api/download", methods=["POST"])
def download():

    data = request.json
    video_id = data.get('videoDownload')
    print("download")
    print(video_id)

    if not video_id:
        return jsonify({"error": "No video url"})
    else:
        print(video_id,url)
        yt = YouTube(url, on_progress_callback=on_progress)
        stream = yt.streams.get_by_itag(video_id)
        try:
            stream.download()
        except Exception as e:
            print(e, stream)
        print("downloading")
        return jsonify({"message": "Download completed successfully!!"})
