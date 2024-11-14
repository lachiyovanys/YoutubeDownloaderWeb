from flask import Flask, jsonify, request, send_file
from pytube.cli import on_progress
from pytubefix import YouTube
from flask_cors import CORS




app = Flask(__name__)
print("Servidor iniciado")
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config["DEBUG"] = True


url = ""
formats = []

@app.route("/api/test", methods=["GET"])
def test():
    return {"name": "test"}

@app.route("/videodownloader", methods=["POST"])
def video_downloader():
    print("Video downloader iniciado")
    global url, formats

    data = request.json
    url = data.get('url')

    try:
        yt = YouTube(url, on_progress_callback=on_progress)
        title = yt.title
        url_image = yt.thumbnail_url
        author = yt.author
        streams = yt.streams






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
    video_url = data.get('videoDownload')


    if not video_url:
        return jsonify({"error": "No video url"})
    else:
        return jsonify({"url": video_url})