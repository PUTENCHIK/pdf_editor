namespace PDF_API.Models {
    public class MyImage {
        public float width;
        public float height;
        public static string uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "images");
        public string path;
        public string fileName;

        public MyImage(IFormFile image, float width, float height) {
            this.width = width;
            this.height = height;
            CanBeUpload(image);
            fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            path = Path.Combine(uploadFolder, fileName);

            Upload(image);
        }

        public string GetPath() {
            return path;
        }

        public bool CanBeUpload(IFormFile image) {
            if (image == null || image.Length == 0) {
                throw new Exception("Empty image.");
            }

            if (!image.ContentType.StartsWith("image/")) {
                throw new Exception("Invalid file type. Only images are allowed.");
            }

            return true;
        }

        public void Upload(IFormFile image) {
            using (var stream = System.IO.File.Create(path)) {
                image.CopyTo(stream);
            }
        }

        public void Clear() {
            if (File.Exists(path)) {
                File.Delete(path);
            }
        }
    }
}
