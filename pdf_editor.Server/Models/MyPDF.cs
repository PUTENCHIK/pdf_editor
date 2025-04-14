using iText.IO.Font.Constants;
using iText.IO.Image;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using System.Drawing;
using iText.Kernel.Geom;
using static System.Net.Mime.MediaTypeNames;
using Swashbuckle.AspNetCore.SwaggerGen;
using PDF_API.Data;
using System.IO;

namespace PDF_API.Models {
    public class MyPDF {
        public static List<string> validExtensions = new List<string>() { ".pdf" };
        public string fileName1;
        public string fileName2 = "";
        public string inputFilePath1;
        public string inputFilePath2 = "";
        public string outputFilePath;
        public int countUploadedDocuments;
        public static string uploadFolder = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "pdf");
        public static Dictionary<string, iText.Kernel.Colors.Color> colors = new Dictionary<string, iText.Kernel.Colors.Color>()
        {
            {"Black", ColorConstants.BLACK},
            {"Blue", ColorConstants.BLUE},
            {"Cyan", ColorConstants.CYAN},
            {"Dark gray", ColorConstants.DARK_GRAY},
            {"Gray", ColorConstants.GRAY},
            {"Green", ColorConstants.GREEN},
            {"Light gray", ColorConstants.LIGHT_GRAY},
            {"Magenta", ColorConstants.MAGENTA},
            {"Orange", ColorConstants.ORANGE},
            {"Pink", ColorConstants.PINK},
            {"Red", ColorConstants.RED},
            {"White", ColorConstants.WHITE},
            {"Yellow", ColorConstants.YELLOW},
        };
        public static Dictionary<string, string> fonts = new Dictionary<string, string>()
        {
            {"Roboto", System.IO.Path.Combine(Directory.GetCurrentDirectory(), "Fonts", "Roboto-Regular.ttf")},
            {"Inter", System.IO.Path.Combine(Directory.GetCurrentDirectory(), "Fonts", "Inter-VariableFont_opsz,wght.ttf")},
            {"Lora", System.IO.Path.Combine(Directory.GetCurrentDirectory(), "Fonts", "Lora-VariableFont_wght.ttf")},
            {"OpenSans", System.IO.Path.Combine(Directory.GetCurrentDirectory(), "Fonts", "OpenSans-VariableFont_wdth,wght.ttf")},
            {"Raleway", System.IO.Path.Combine(Directory.GetCurrentDirectory(), "Fonts", "Raleway-VariableFont_wght.ttf")},
            {"Ubuntu", System.IO.Path.Combine(Directory.GetCurrentDirectory(), "Fonts", "Ubuntu-Regular.ttf")},
        };
        private readonly AppDbContext _context;


        public MyPDF(IFormFile fileToUpload1, AppDbContext context) {
            //_context = context;

            //CanBeUpload(fileToUpload1);
            //fileName1 = Upload(fileToUpload1);
            //inputFilePath1 = GetUploadPath(fileName1);
            //outputFilePath = GetEditPath(fileName1);
            //countUploadedDocuments = 1;
        }

        public MyPDF(IFormFile fileToUpload1, IFormFile fileToUpload2, AppDbContext context) {
            //_context = context;

            //if (!Directory.Exists(uploadFolder)) {
            //    Directory.CreateDirectory(uploadFolder);
            //}

            //CanBeUpload(fileToUpload1);
            //CanBeUpload(fileToUpload2);

            //fileName1 = Upload(fileToUpload1);
            //fileName2 = Upload(fileToUpload2);
            //inputFilePath1 = GetUploadPath(fileName1);
            //inputFilePath2 = GetUploadPath(fileName2);
            //outputFilePath = GenerateNewPath(fileName1);
            //countUploadedDocuments = 2;
        }

        public static int GetPageCount(string inputFilePath) {
            using (var pdfDocument = new PdfDocument(new PdfReader(inputFilePath))) {
                return pdfDocument.GetNumberOfPages();
            }
        }

        public string getOutputFilePath() {
            return outputFilePath;
        }

        public static bool CanBeUpload(IFormFile file) {
            string extention = System.IO.Path.GetExtension(file.FileName);

            if (!validExtensions.Contains(extention)) {
                throw new PDFException("Extension is not valid");
            }

            long size = file.Length;

            if (size > (100 * 1024 * 1024)) {
                throw new PDFException("Uploaded file too large");
            }

            return true;
        }

        public static string Upload(IFormFile file) {
            string extention = System.IO.Path.GetExtension(file.FileName);

            string fileName = Guid.NewGuid().ToString() + extention;
            string fullFilePath = System.IO.Path.Combine(uploadFolder, fileName);

            using FileStream stream = new FileStream(fullFilePath, FileMode.Create);

            file.CopyTo(stream);

            return fullFilePath;
        }

        public static void DeleteFile(string filePath) {
            if (File.Exists(filePath)) {
                File.Delete(filePath);
            }
        }

        public string GetUploadPath(string fileName) {
            return System.IO.Path.Combine(uploadFolder, fileName);
        }

        public static string GenerateNewPath(string fullFilePath) {
            var fileDirectory = System.IO.Path.GetDirectoryName(fullFilePath);
            var fileNewName = Guid.NewGuid().ToString();
            var fileExtension = System.IO.Path.GetExtension(fullFilePath);

            if (fileDirectory == null) {
                return System.IO.Path.Combine(fileNewName, fileExtension);
            }

            return System.IO.Path.Combine(fileDirectory, fileNewName + fileExtension);
        }

        public void Clear() {
            if (countUploadedDocuments == 1) {
                DeleteFile(inputFilePath1);
                DeleteFile(outputFilePath);
            }
            else if (countUploadedDocuments == 2) {
                DeleteFile(inputFilePath1);
                DeleteFile(inputFilePath2);
                DeleteFile(outputFilePath);
            }
        }

        public static string DeletePage(string inputFilePath, int pageNumber) {
            int[] pagesToDelete = { pageNumber };
            string outputFilePath = GenerateNewPath(inputFilePath);

            using (var pdfDocument = new PdfDocument(new PdfReader(inputFilePath), new PdfWriter(outputFilePath))) {
                if (pageNumber < 1 || pageNumber > pdfDocument.GetNumberOfPages()) {
                    throw new PDFException("The page specified is outside the scope of the document.");
                }

                int deleted = 0;
                foreach (var i in pagesToDelete) {
                    pdfDocument.RemovePage(i - deleted);
                    deleted++;
                }
            }

            return outputFilePath;
        }

        public static string SwapPages(string inputFilePath, int pageFromSwap, int pageToSwap) {
            List<int> pages = new List<int>();
            string outputFilePath = GenerateNewPath(inputFilePath);

            using (var inputPdfDocument = new PdfDocument(new PdfReader(inputFilePath))) {
                using (var outputPdfDocument = new PdfDocument(new PdfWriter(outputFilePath))) {
                    if (pageFromSwap < 1 || pageToSwap < 1 || pageFromSwap > inputPdfDocument.GetNumberOfPages()
                        || pageToSwap > inputPdfDocument.GetNumberOfPages()) {
                        throw new PDFException("The page specified is outside the scope of the document.");
                    }

                    for (int i = 1; i <= inputPdfDocument.GetNumberOfPages(); i++) {
                        pages.Add(i);
                    }

                    pages[pageFromSwap - 1] = pageToSwap;
                    pages[pageToSwap - 1] = pageFromSwap;

                    inputPdfDocument.CopyPagesTo(pages, outputPdfDocument);
                }
            }

            return outputFilePath;
        }

        public static string CombineFiles(string inputFilePath1, string inputFilePath2) {
            string outputFilePath = GenerateNewPath(inputFilePath1);

            using (var inputPdfDocument2 = new PdfDocument(new PdfReader(inputFilePath2))) {
                using (var outputPdfDocument = new PdfDocument(new PdfReader(inputFilePath1), new PdfWriter(outputFilePath))) {
                    List<int> pages = new List<int>();

                    for (int i = 1; i <= inputPdfDocument2.GetNumberOfPages(); i++) {
                        pages.Add(i);
                    }

                    inputPdfDocument2.CopyPagesTo(pages, outputPdfDocument);
                }
            }

            return outputFilePath;
        }

        //public static void SplitFile(int breakPage) {
        //    using (var inputPdfDocument = new PdfDocument(new PdfReader(inputFilePath1), new PdfWriter(inputFilePath1))) {
        //        using (var outputPdfDocument = new PdfDocument(new PdfWriter(outputFilePath))) {

        //            if (breakPage < 1 || breakPage > inputPdfDocument.GetNumberOfPages()) {
        //                throw new PDFException("The page specified is outside the scope of the document.");
        //            }

        //            List<int> pages = new List<int>();
        //            for (int i = breakPage; i <= inputPdfDocument.GetNumberOfPages(); i++) {
        //                pages.Add(i);
        //            }


        //            inputPdfDocument.CopyPagesTo(pages, outputPdfDocument);

        //            int deleted = 0;
        //            foreach (var i in pages) {
        //                inputPdfDocument.RemovePage(i - deleted);
        //                deleted++;
        //            }
        //        }
        //    }
        //}

        public static string InsertImage(string inputFilePath, MyImage image, int pageNumberToInsert, int x, int y) {
            string outputFilePath = GenerateNewPath(inputFilePath);

            using (var inputPdfDocument = new PdfDocument(new PdfReader(inputFilePath), new PdfWriter(outputFilePath))) {
                using (var document = new Document(inputPdfDocument)) {
                    if (pageNumberToInsert < 1 || pageNumberToInsert > inputPdfDocument.GetNumberOfPages()) {
                        throw new PDFException("The page specified is outside the scope of the document.");
                    }

                    var pagePageSize = inputPdfDocument.GetPage(pageNumberToInsert).GetPageSize();

                    if (y < 0 || y > pagePageSize.GetHeight() || x < 0 || x > pagePageSize.GetWidth()) {
                        throw new PDFException("The coordinates specified are outside the page.");
                    }

                    if (image.height < 0 || image.height > pagePageSize.GetHeight() || image.width < 0 || image.width > pagePageSize.GetWidth()) {
                        throw new PDFException("Dimensions are beyond the page.");
                    }


                    ImageData imageData = ImageDataFactory.Create(image.GetPath());

                    var newImage = new iText.Layout.Element.Image(imageData).ScaleAbsolute(image.width, image.height).SetFixedPosition(pageNumberToInsert, x, pagePageSize.GetHeight() - image.height - y);
                    document.Add(newImage);
                }
            }

            return outputFilePath;
        }

        public static string RotatePages(string inputFilePath, int degrees) {
            string outputFilePath = GenerateNewPath(inputFilePath);

            using (var pdfDocument = new PdfDocument(new PdfReader(inputFilePath), new PdfWriter(outputFilePath))) {
                for (int i = 1; i <= pdfDocument.GetNumberOfPages(); i++) {
                    var page = pdfDocument.GetPage(i);
                    page.SetRotation(degrees);
                }
            }

            return outputFilePath;
        }

        public static string AddText(string inputFilePath, string text, int pageNumber, int x, int y, float FontSize, string font, bool isBold, string fontColor) {
            string outputFilePath = GenerateNewPath(inputFilePath);

            using (var pdfDocument = new PdfDocument(new PdfReader(inputFilePath), new PdfWriter(outputFilePath))) {
                if (pageNumber < 1 || pageNumber > pdfDocument.GetNumberOfPages()) {
                    throw new PDFException("The page specified is outside the scope of the document.");
                }

                var pagePageSize = pdfDocument.GetPage(pageNumber).GetPageSize();

                if (y < 0 || y > pagePageSize.GetHeight() || x < 0 || x > pagePageSize.GetWidth()) {
                    throw new PDFException("The coordinates specified are outside the page.");
                }


                PdfFont code;
                if (fonts.ContainsKey(font)) {
                    code = PdfFontFactory.CreateFont(fonts[font]);
                }
                else {
                    code = PdfFontFactory.CreateFont(fonts["Roboto"]);
                    //throw new PDFException("The specified font was not found.");
                }

                iText.Kernel.Colors.Color color;
                if (colors.ContainsKey(fontColor)) {
                    color = colors[fontColor];
                }
                else {
                    throw new PDFException("The specified font color was not found.");
                }

                Style style = new Style()
                    .SetFont(code)
                    .SetFontSize(FontSize)
                    .SetFontColor(color);

                if (isBold) {
                    style.SetBold();
                }

                Paragraph paragraph = new Paragraph()
                    .Add(new iText.Layout.Element.Text(text).AddStyle(style));

                using (Document document = new Document(pdfDocument)) {
                    document.ShowTextAligned(paragraph, x, pagePageSize.GetHeight() - y, pageNumber, TextAlignment.LEFT, VerticalAlignment.TOP, 0);
                }
            }

            return outputFilePath;
        }

        public static string CropPage(string inputFilePath, int pageNumber, int x, int y, float width, float height) {
            string outputFilePath = GenerateNewPath(inputFilePath);

            using (var pdfDocument = new PdfDocument(new PdfReader(inputFilePath), new PdfWriter(outputFilePath))) {
                if (pageNumber < 1 || pageNumber > pdfDocument.GetNumberOfPages()) {
                    throw new PDFException("The page specified is outside the scope of the document.");
                }

                PdfPage page = pdfDocument.GetPage(pageNumber);
                var pagePageSize = page.GetPageSize();

                if (y < 0 || y > pagePageSize.GetHeight() || x < 0 || x > pagePageSize.GetWidth()) {
                    throw new PDFException("The coordinates specified are outside the page.");
                }
                if (height < 0 || height > pagePageSize.GetHeight() || width < 0 || width > pagePageSize.GetWidth()) {
                    throw new PDFException("Dimensions are beyond the page.");
                }


                var cropBox = new iText.Kernel.Geom.Rectangle(x, y, width, height);

                page.SetCropBox(cropBox);
            }

            return outputFilePath;
        }
    }
}
