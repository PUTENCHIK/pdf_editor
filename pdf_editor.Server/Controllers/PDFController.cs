﻿using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PDF_API.Models;


namespace PDF_API.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class PDFController : ControllerBase {

        [HttpPost("CanFileBeUploaded")]
        public IActionResult CanFileBeUploaded(IFormFile file) {
            try {
                MyPDF.CanBeUpload(file);
                return Ok("Success");
            }
            catch (PDFException e) {
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                return StatusCode(500, "Internal Server Error");
            }
        }
        [HttpPost("DeletePage")]
        public ActionResult DeletePage(IFormFile fileToUpload, int pageNumber) {
            MyPDF? mypdf = null;
            try {
                mypdf = new MyPDF(fileToUpload);

                mypdf.DeletePage(pageNumber);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("SwapPages")]
        public ActionResult SwapPages(IFormFile fileToUpload, int pageFromSwap, int pageToSwap) {
            MyPDF? mypdf = null;
            try {
                mypdf = new MyPDF(fileToUpload);

                mypdf.SwapPages(pageFromSwap, pageToSwap);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("CombinePdfFiles")]
        public ActionResult CombinePdfFiles(IFormFile fileToUpload1, IFormFile fileToUpload2) {
            MyPDF? mypdf = null;
            try {
                mypdf = new MyPDF(fileToUpload1, fileToUpload2);

                mypdf.CombineFiles();

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("SplitFile")]
        public ActionResult SplitFile(IFormFile fileToUpload, int breakPage) {
            MyPDF? mypdf = null;
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

                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("InsertImage")]
        public ActionResult InsertImage(IFormFile pdfFileToUpload, IFormFile imageFileToUpload, int pageNumberToInsert, float width, float height, int x, int y) {
            MyPDF? mypdf = null;
            MyImage? myimage = null;

            try {
                mypdf = new MyPDF(pdfFileToUpload);
                myimage = new MyImage(imageFileToUpload, width, height);

                mypdf.InsertImage(myimage, pageNumberToInsert, x, y);

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

                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }
                if (myimage != null) {
                    myimage.Clear();
                }

                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("RotatePages")]
        public ActionResult RotatePages(IFormFile fileToUpload, int degrees) {
            MyPDF? mypdf = null;

            try {
                mypdf = new MyPDF(fileToUpload);

                mypdf.RotatePages(degrees);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }
                return StatusCode(500, "Internal Server Error");
            }
        }


        [HttpPost("AddText")]
        public ActionResult AddText(IFormFile fileToUpload, string text, int pageNumber, int x, int y, float FontSize = 12, string font = "Helvetica", bool isBold = false, string fontColor = "Black") {
            MyPDF? mypdf = null;

            try {
                mypdf = new MyPDF(fileToUpload);

                mypdf.AddText(text, pageNumber, x, y, FontSize, font, isBold, fontColor);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("CropPage")]
        public ActionResult CropPage(IFormFile fileToUpload, int pageNumber, int x, int y, float width, float height) {
            MyPDF? mypdf = null;

            try {
                mypdf = new MyPDF(fileToUpload);

                mypdf.CropPage(pageNumber, x, y, width, height);

                byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());
                mypdf.Clear();

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }

                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (mypdf != null) {
                    mypdf.Clear();
                }
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}