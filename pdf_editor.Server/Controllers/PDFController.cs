using iText.Kernel.Pdf.Canvas.Wmf;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using PDF_API.Models;
using pdf_editor.Server.Requests;
using System.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace PDF_API.Controllers {

    [Route("api/[controller]")]
    [ApiController]
    public class PDFController : ControllerBase {

        private readonly ILogger<PDFController> _logger;

        public PDFController(ILogger<PDFController> logger) {
            _logger = logger;
        }

        [HttpPost("CanFileBeUploaded")]
        public IActionResult CanFileBeUploaded(CanFileBeUploadedRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                MyPDF.CanBeUpload(data.file);
                return Ok("Success");
            }
            catch (PDFException e) {
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("DeletePage")]
        public ActionResult DeletePage(DeletePageRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            MyPDF? mypdf = null;

            try {
                mypdf = new MyPDF(data.file);

                mypdf.DeletePage(data.pageNumber);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("SwapPages")]
        public ActionResult SwapPages(SwapPagesRequest data) {
            MyPDF? mypdf = null;
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                mypdf = new MyPDF(data.file);

                mypdf.SwapPages(data.pageFrom, data.pageTo);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("CombinePdfFiles")]
        public ActionResult CombinePdfFiles(CombinePdfFilesRequest data) {
            MyPDF? mypdf = null;
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                mypdf = new MyPDF(data.file, data.file2);

                mypdf.CombineFiles();

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("SplitFile")]
        public ActionResult SplitFile(IFormFile fileToUpload, int breakPage) {
            MyPDF? mypdf = null;
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                mypdf = new MyPDF(fileToUpload);

                mypdf.SplitFile(breakPage);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                // Два варианта для отправки нескольких pdf файлов.
                // 1) zip файлом отправить.
                // 2) отправить пути до файла, и потом клиент несколько раз отправляет запрос.
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("InsertImage")]
        public ActionResult InsertImage(InsertImageRequest data) {
            MyPDF? mypdf = null;
            MyImage? myimage = null;
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                mypdf = new MyPDF(data.file);
                myimage = new MyImage(data.imageFile, data.width, data.height);

                mypdf.InsertImage(myimage, data.pageNumber, data.x, data.y);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();
                myimage.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }
                if (myimage != null) {
                    myimage.Clear();
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }
                if (myimage != null) {
                    myimage.Clear();
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("RotatePages")]
        public ActionResult RotatePages(RotatePagesRequest data) {
            MyPDF? mypdf = null;
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                mypdf = new MyPDF(data.file);

                mypdf.RotatePages(data.degrees);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }


        [HttpPost("AddText")]
        public ActionResult AddText(AddTextRequest data) {
            MyPDF? mypdf = null;
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            try {
                mypdf = new MyPDF(data.file);

                mypdf.AddText(data.text, data.pageNumber, data.x, data.y, data.fontSize, data.font, data.isBold, data.fontColor);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("CropPage")]
        public ActionResult CropPage(CropPageRequest data) {
            MyPDF? mypdf = null;
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                mypdf = new MyPDF(data.file);

                mypdf.CropPage(data.pageNumber, data.x, data.y, data.width, data.height);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}