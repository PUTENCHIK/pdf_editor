using iText.StyledXmlParser.Jsoup.Nodes;
using PDF_API;
using PDF_API.Data;
using System.Security.Cryptography;

namespace pdf_editor.Server.Models {
    public class DbPDF {
        public static bool Check(AppDbContext context, string fileId) {
            var result = context.Files.Where(p => p.SecuredId == fileId).ToList();

            if (result.Count > 0) {
                return true;
            }
            else {
                return false;
            }
        }

        public static string GetPdfPath(AppDbContext context, string fileId) {
            var result = context.Files.Where(p => p.SecuredId == fileId).First();

            result.LastActivityTime = DateTime.Now;
            context.SaveChanges();

            return result.Path;
        }

        public static void UpdatePath(AppDbContext context, string fileId, string newPath) {
            var result = context.Files.Where(p => p.SecuredId == fileId).First();

            result.Path = newPath;
            context.SaveChanges();
        }

        public static string Add(AppDbContext context, string Path) {
            string fileId = Guid.NewGuid().ToString();

            PDFFile file = new PDFFile {
                SecuredId = fileId,
                Path = Path,
                LastActivityTime = DateTime.Now,
                CreateAt = DateTime.Now
            };

            context.Files.Add(file);
            context.SaveChanges();

            return fileId;
        }

        public static bool Delete(AppDbContext context, string fileId) {
            var result = context.Files.Where(p => p.SecuredId == fileId).ToList();

            if (result.Count > 0) {
                context.Remove(result[0]);
                return true;
            }
            else {
                return false;
            }
        }
    }
}
