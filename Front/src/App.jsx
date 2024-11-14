import './App.css';
import { useState } from 'react';
import { Circles } from 'react-loader-spinner'

const App = () => {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [urlImage, setUrlImage] = useState("");
    const [urlVideo, setUrlVideo] = useState("");
    const [formats, setFormats] = useState([]);
    const [message, setMessage] = useState("");
    const [videoDownload, setVideoDownload] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the URL is empty
        if (!url) {
            setMessage("Please enter a URL");
            return;
        }

        try {
            // Make the POST request
            const response = await fetch('/api/videodownloader', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Set the video information in state
            setTitle(data.title);
            setAuthor(data.author);
            setUrlImage(data.url_image);
            setFormats(data.formats || []);
            setMessage("Video found"); // Success message
        } catch (error) {
            console.error('Error:', error);
            setMessage("Video not found."); // Display error message
        }
    };

    const handleDownload = (e) => {
        e.preventDefault();

        // Show message indicating download is starting
        setMessage("Processing...");
        setLoading(true)

        fetch('http://127.0.0.1:5000/api/download', {
            method: 'POST', // Change to POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoDownload }) // Send videoDownload in the body
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setMessage("Downloading")
                return response.json();
            })
            .then(data => {
                // Update UI based on the response from the backend
                setMessage(data.message || "Download completed!"); // Display the message
                setDone(true); // Set the download completion state
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(error.message);
                setMessage(`Ocurrió un error durante la descarga.`);

            })
            .finally(() => {
            // End loading state regardless of success or failure
            setLoading(false);
        });

    };

    return (
        <>
            <div className="justify-center max-w-full min-h-screen grid place-content-center bg-blue-200">
                <form onSubmit={handleSubmit}
                      className="flex flex-col max-w-screen-2xl p-6 rounded-lg bg-white gap-5 items-center shadow-xl ">
                    <h1 className="text-gray-900">Enter YouTube URL</h1>
                    <input type="text" id="url" onChange={(e) => setUrl(e.target.value)} value={url}
                           className="w-full p-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <input type="submit" value="Submit" className="bg-blue-500 rounded-3xl p-2 min-w-60"/>
                </form>

                {url &&
                    <section className="text-center text-gray-900 bg-white flex justify-center flex-col mt-14 rounded-lg gap-2 p-3">
                        {message && <p>{message}</p>}
                        <div className="flex gap-2">
                            {!loading ? (
                                <>
                                    {!done ? (
                                        <>{urlImage && <img src={urlImage} alt="Video Thumbnail" className="max-w-56"/>}
                                        <div className="flex gap-2 flex-col ">
                                            {title && <h3>{title}</h3>}
                                            {author && <small className="text-left">By {author}</small>}
                                        </div></>) : ("<h2>Done!!</h2>")}

                                </>
                            ) : (
                                loading && (
                                    <>
                                    <div className="flex w-full justify-center">
                                    <Circles
                                        height="80"
                                        width="80"
                                        color="gray"
                                        ariaLabel="circles-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        visible={true}
                                    />
                                        </div>
                                    </>

                                )
                            )}
                        </div>


                        {!loading ? (<>{formats.length > 0 && (
                            <select onChange={e => setVideoDownload(e.target.value)} value={videoDownload}>
                                {formats.map(f => (
                                    <option key={f.id.toString()} value={f.itag} selected>
                                        {f.type} | {f.extension} | {f.size + "MB"}
                                    </option>
                                ))}
                            </select>
                        )}
                            {videoDownload &&
                                <button onClick={handleDownload}>Download</button>
                            } {/* Desactiva si no hay formato seleccionado */}</>) : (<></>)}

                </section>}
            </div>
        </>
    );
}

export default App;
