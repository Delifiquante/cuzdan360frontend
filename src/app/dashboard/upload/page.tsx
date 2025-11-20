import { PageHeader } from "@/components/layout/page-header";
import { FileUpload } from "@/components/upload/file-upload";

export default function UploadPage() {
  return (
    <div>
      <PageHeader
        title="Dosya Yükleme"
        description="Dosyalarınızı yüklemek için bu sayfayı kullanabilirsiniz."
      />
      <div className="p-4">
        <FileUpload />
      </div>
    </div>
  );
}
