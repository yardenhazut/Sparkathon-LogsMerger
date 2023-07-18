package flow.logsmerger.controllers;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;


@Service
public class FileConversionService {

    public byte[] createPdf(List<String> data) throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, outputStream);

        document.open();
        for (String line : data) {
            document.add(new Paragraph(line));
        }
        document.close();

        return outputStream.toByteArray();
    }
}

