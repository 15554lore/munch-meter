//Fetches image from server using the file path
export async function fetchImage(file_path) {
  const res = await fetch(`/fetchimage/${file_path}`);
  const imageBlob = await res.blob();
  const imageObjectURL = URL.createObjectURL(imageBlob);
  return imageObjectURL;
  //Returns an image url which can be opened to access the image
}
