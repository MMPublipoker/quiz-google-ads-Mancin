import Foundation
import PDFKit

struct Extractor {
  static func run() {
    let arguments = CommandLine.arguments

    guard arguments.count >= 2 else {
      fputs("Usage: swift extract_pdf_text.swift <pdf-path>\n", stderr)
      exit(1)
    }

    let pdfURL = URL(fileURLWithPath: arguments[1])

    guard let document = PDFDocument(url: pdfURL) else {
      fputs("Unable to open PDF at \(pdfURL.path)\n", stderr)
      exit(2)
    }

    print("# \(pdfURL.lastPathComponent)")
    print("# Pages: \(document.pageCount)")
    print("")

    for pageIndex in 0..<document.pageCount {
      guard let page = document.page(at: pageIndex) else {
        continue
      }

      let pageText = page.string?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""

      print("## Page \(pageIndex + 1)")
      print("")
      if pageText.isEmpty {
        print("[no extractable text]")
      } else {
        print(pageText)
      }
      print("")
    }
  }
}

Extractor.run()
