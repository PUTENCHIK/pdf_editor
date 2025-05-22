using iText.IO.Image;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using PDF_API.Data;
using iText.Kernel.Pdf.Canvas;
using Rectangle = iText.Kernel.Geom.Rectangle;

namespace PDF_API.Models {
    public class MyPDF {
        public static List<string> validExtensions = new List<string>() { ".pdf" };
        public int countUploadedDocuments;
        public static string uploadFolder = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "pdf");
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

        public static int GetPageCount(string inputFilePath) {
            using (var pdfDocument = new PdfDocument(new PdfReader(inputFilePath))) {
                return pdfDocument.GetNumberOfPages();
            }
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

        public static bool CanBeUploadWord(IFormFile file) {
            string extention = System.IO.Path.GetExtension(file.FileName);

            if (extention == ".docx") {
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

        public static string SplitFile(string inputFilePath, int breakPage) {
            string outputFilePath = GenerateNewPath(inputFilePath);
            List<int> pagesToDelete = new List<int>();
            int countPages;

            byte[] pdfBytes = File.ReadAllBytes(inputFilePath);
            using (MemoryStream inputStream = new MemoryStream(pdfBytes)) {
                using (var inputPdfDocument = new PdfDocument(new PdfReader(inputStream))) {
                    countPages = inputPdfDocument.GetNumberOfPages();
                    if (breakPage < 1 || breakPage > countPages) {
                        throw new PDFException("The page specified is outside the scope of the document.");
                    }

                    List<int> pagesToCopy = new List<int>();
                    for (int i = breakPage; i <= countPages; i++) {
                        pagesToCopy.Add(i);
                    }

                    using (var outputPdfDocument = new PdfDocument(new PdfWriter(outputFilePath))) {
                        inputPdfDocument.CopyPagesTo(pagesToCopy, outputPdfDocument);
                    }

                    for (int i = breakPage; i <= countPages; i++) {
                        pagesToDelete.Add(i);
                    }
                }
            }

            using (MemoryStream inputStream = new MemoryStream(pdfBytes))
            using (MemoryStream outputStream = new MemoryStream()) {
                using (var inputPdfDocument = new PdfDocument(new PdfReader(inputStream), new PdfWriter(outputStream))) {
                    int deleted = 0;
                    foreach (var i in pagesToDelete) {
                        inputPdfDocument.RemovePage(i - deleted);
                        deleted++;
                    }
                }

                File.WriteAllBytes(inputFilePath, outputStream.ToArray());
            }


            return outputFilePath;
        }

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

                    PdfPage page = inputPdfDocument.GetPage(pageNumberToInsert);
                    iText.Kernel.Geom.Rectangle actualCropBox = page.GetCropBox();
                    float offsetX = actualCropBox.GetX();
                    float offsetY = actualCropBox.GetY();

                    float trueX = x + offsetX;
                    float trueY = y + offsetY;
                    

                    ImageData imageData = ImageDataFactory.Create(image.GetPath());

                    //var newImage = new iText.Layout.Element.Image(imageData).ScaleAbsolute(image.width, image.height).SetFixedPosition(pageNumberToInsert, trueX, pagePageSize.GetHeight() - image.height - trueY);
                    var newImage = new iText.Layout.Element.Image(imageData).ScaleAbsolute(image.width, image.height).SetFixedPosition(pageNumberToInsert, trueX, trueY);
                    document.Add(newImage);
                }
            }

            return outputFilePath;
        }

        public static string RotatePages(string inputFilePath, bool isRight) {
            string outputFilePath = GenerateNewPath(inputFilePath);

            using (var pdfDocument = new PdfDocument(new PdfReader(inputFilePath), new PdfWriter(outputFilePath))) {
                for (int i = 1; i <= pdfDocument.GetNumberOfPages(); i++) {
                    var page = pdfDocument.GetPage(i);
                    var pageDegrees = page.GetRotation();
                    if (isRight) {
                        page.SetRotation(pageDegrees + 90);
                    }
                    else {
                        page.SetRotation(pageDegrees - 90);
                    }
                }
            }

            return outputFilePath;
        }

        public static string RotatePage(string inputFilePath, int pageNumber, bool isRight) {
            string outputFilePath = GenerateNewPath(inputFilePath);

            using (var pdfDocument = new PdfDocument(new PdfReader(inputFilePath), new PdfWriter(outputFilePath))) {
                var page = pdfDocument.GetPage(pageNumber);
                var pageDegrees = page.GetRotation();
                if (isRight) {
                    page.SetRotation(pageDegrees + 90);
                }
                else {
                    page.SetRotation(pageDegrees - 90);
                }
            }

            return outputFilePath;
        }

        public static List<string> GetAllFonts() {
            List<string> result = new List<string>();
            foreach (var (key, value) in fonts) {
                result.Add(key);
            }
            return result;
        }

        public static string AddText(string inputFilePath, string text, int pageNumber, int x, int y, float FontSize, string font, bool isBold, bool isItalic, bool isUnderline, string htmlColorCode) {
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
                }

                iText.Kernel.Colors.Color itextColor;
                try {
                    if (htmlColorCode.StartsWith("#")) {
                        htmlColorCode = htmlColorCode.Substring(1);
                    }

                    System.Drawing.Color systemColor = System.Drawing.ColorTranslator.FromHtml("#" + htmlColorCode);
                    itextColor = new DeviceRgb(systemColor.R / 255f, systemColor.G / 255f, systemColor.B / 255f);
                }
                catch (Exception ex) {
                    itextColor = ColorConstants.BLACK;
                }

                Style style = new Style()
                    .SetFont(code)
                    .SetFontSize(FontSize)
                    .SetFontColor(itextColor);

                if (isBold) {
                    style.SetBold();
                }

                if (isItalic) {
                    style.SetItalic();
                }

                if (isUnderline) {
                    style.SetUnderline();
                }

                Paragraph paragraph = new Paragraph()
                    .Add(new iText.Layout.Element.Text(text).AddStyle(style));

                PdfPage page = pdfDocument.GetPage(pageNumber);
                iText.Kernel.Geom.Rectangle actualCropBox = page.GetCropBox();
                float offsetX = actualCropBox.GetX();
                float offsetY = actualCropBox.GetY();

                float trueX = x + offsetX;
                float trueY = y + offsetY;

                using (Document document = new Document(pdfDocument)) {
                    document.ShowTextAligned(paragraph, trueX, trueY, pageNumber, TextAlignment.LEFT, VerticalAlignment.BOTTOM, 0);
                }
            }

            return outputFilePath;
        }

        public static string EditText(string inputFilePath, string text, int pageNumber, int x, int y, float FontSize, string font, bool isBold, bool isItalic, bool isUnderline, string htmlColorCode) {
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
                }

                iText.Kernel.Colors.Color itextColor;
                try {
                    if (htmlColorCode.StartsWith("#")) {
                        htmlColorCode = htmlColorCode.Substring(1);
                    }

                    System.Drawing.Color systemColor = System.Drawing.ColorTranslator.FromHtml("#" + htmlColorCode);
                    itextColor = new DeviceRgb(systemColor.R / 255f, systemColor.G / 255f, systemColor.B / 255f);
                }
                catch (Exception ex) {
                    itextColor = ColorConstants.BLACK;
                }

                Style style = new Style()
                    .SetFont(code)
                    .SetFontSize(FontSize)
                    .SetFontColor(itextColor);

                if (isBold) {
                    style.SetBold();
                }

                if (isItalic) {
                    style.SetItalic();
                }

                if (isUnderline) {
                    style.SetUnderline();
                }

                PdfPage page = pdfDocument.GetPage(pageNumber);
                iText.Kernel.Geom.Rectangle actualCropBox = page.GetCropBox();
                float offsetX = actualCropBox.GetX();
                float offsetY = actualCropBox.GetY();

                float trueX = x + offsetX;
                float trueY = y + offsetY;

                Paragraph paragraph = new Paragraph()
                    .Add(new iText.Layout.Element.Text(text).AddStyle(style));

                using (Document document = new Document(pdfDocument)) {
                    PdfCanvas canvas = new PdfCanvas(page);

                    string[] lines = text.Split('\n');
                    float currentY = trueY;

                    foreach (string line in lines) {
                        Paragraph paragraph1 = new Paragraph()
                                                    .Add(new iText.Layout.Element.Text(line).AddStyle(style));

                        float textWidth = code.GetWidth(line, FontSize);

                        canvas.SaveState()
                                .SetFillColor(ColorConstants.WHITE)
                                .SetStrokeColor(ColorConstants.WHITE)
                                .Rectangle(trueX, currentY - FontSize, textWidth, FontSize * 1.1f)
                                .FillStroke()
                                .RestoreState();

                        document.ShowTextAligned(paragraph1, trueX, currentY, pageNumber, TextAlignment.LEFT, VerticalAlignment.TOP, 0);

                        currentY += FontSize * 1.3f;
                    }
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

                iText.Kernel.Geom.Rectangle actualCropBox = page.GetCropBox();
                float offsetX = actualCropBox.GetX();
                float offsetY = actualCropBox.GetY();

                var cropBox = new iText.Kernel.Geom.Rectangle(x + offsetX, y + offsetY, width, height);


                page.SetCropBox(cropBox);


            }

            return outputFilePath;
        }

        public static string CompressFile(string inputFilePath, int compressionRatio) {
            if (compressionRatio < 0 || compressionRatio > 9) {
                throw new PDFException("The compression ratio specified is outside the scope.");
            }

            string outputFilePath = GenerateNewPath(inputFilePath);

            using (var pdfDocument = new PdfDocument(new PdfReader(inputFilePath), new PdfWriter(outputFilePath))) {
                pdfDocument.GetWriter().SetCompressionLevel(compressionRatio);
            }

            return outputFilePath;
        }

        public static string DeleteText(string inputFilePath, int pageNumber, float x1, float y1, float x2, float y2) {
            string outputFilePath = GenerateNewPath(inputFilePath);

            using (var inputPdfDocument = new PdfDocument(new PdfReader(inputFilePath), new PdfWriter(outputFilePath))) {
                if (pageNumber < 1 || pageNumber > inputPdfDocument.GetNumberOfPages()) {
                    throw new PDFException("The page specified is outside the scope of the document.");
                }

                PdfPage page = inputPdfDocument.GetPage(pageNumber);
                var pagePageSize = page.GetPageSize();

                if (y1 < 0 || y1 > pagePageSize.GetHeight() || x1 < 0 || x1 > pagePageSize.GetWidth()) {
                    throw new PDFException("The coordinates specified are outside the page.");
                }

                if (y2 < 0 || y2 > pagePageSize.GetHeight() || x2 < 0 || x2 > pagePageSize.GetWidth()) {
                    throw new PDFException("The coordinates 2 specified are outside the page.");
                }

                iText.Kernel.Geom.Rectangle actualCropBox = page.GetCropBox();
                float offsetX = actualCropBox.GetX();
                float offsetY = actualCropBox.GetY();

                float trueX1 = x1 + offsetX;
                float trueY1 = y1 + offsetY;

                float trueX2 = x2 + offsetX;
                float trueY2 = y2 + offsetY;

                float width = Math.Abs(trueX2 - trueX1);
                float height = Math.Abs(trueY2 - trueY1);

                if (width <= 0 || height <= 0) {
                    throw new PDFException("Incorrect corner coordinates. x2 must be greater than x1, and y2 must be greater than y1.");
                }

                Rectangle rect = new Rectangle(trueX1, trueY2, width, height);
                PdfCanvas canvas = new PdfCanvas(page);

                DeviceRgb whiteColor = new DeviceRgb(255, 255, 255);
                canvas.SetColor(whiteColor, false);
                canvas.SetFillColor(ColorConstants.WHITE);
                canvas.Rectangle(rect);
                canvas.Fill();
            }

            return outputFilePath;
        }
    }
}
