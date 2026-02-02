import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Download, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ConversionTool, FileState, ConversionStatus } from '@/types';

const tools: ConversionTool[] = [
  {
    id: 'pdf-to-word',
    title: 'PDF转Word',
    description: '将PDF文档转换为可编辑的Word格式',
    image: '/pdf-to-word.png',
    from: 'PDF',
    to: 'DOCX',
    acceptTypes: '.pdf',
  },
  {
    id: 'pdf-to-excel',
    title: 'PDF转Excel',
    description: '将PDF表格转换为CSV格式',
    image: '/pdf-to-excel.png',
    from: 'PDF',
    to: 'CSV',
    acceptTypes: '.pdf',
  },
  {
    id: 'pdf-to-ppt',
    title: 'PDF转PPT',
    description: '将PDF演示文稿转换为PowerPoint',
    image: '/pdf-to-ppt.png',
    from: 'PDF',
    to: 'PPTX',
    acceptTypes: '.pdf',
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF转JPG',
    description: '将PDF页面转换为JPG图片',
    image: '/pdf-to-jpg.png',
    from: 'PDF',
    to: 'JPG',
    acceptTypes: '.pdf',
  },
  {
    id: 'word-to-pdf',
    title: 'Word转PDF',
    description: '将Word文档转换为PDF格式',
    image: '/word-to-pdf.png',
    from: 'DOCX',
    to: 'PDF',
    acceptTypes: '.doc,.docx',
  },
  {
    id: 'excel-to-pdf',
    title: 'Excel转PDF',
    description: '将Excel表格转换为PDF格式',
    image: '/excel-to-pdf.png',
    from: 'XLSX',
    to: 'PDF',
    acceptTypes: '.xls,.xlsx,.csv',
  },
  {
    id: 'ppt-to-pdf',
    title: 'PPT转PDF',
    description: '将PowerPoint转换为PDF格式',
    image: '/ppt-to-pdf.png',
    from: 'PPTX',
    to: 'PDF',
    acceptTypes: '.ppt,.pptx',
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG转PDF',
    description: '将JPG图片转换为PDF文档',
    image: '/jpg-to-pdf.png',
    from: 'JPG',
    to: 'PDF',
    acceptTypes: '.jpg,.jpeg,.png,.gif,.bmp,.webp',
  },
  {
    id: 'merge-pdf',
    title: '合并PDF',
    description: '将多个PDF文件合并为一个',
    image: '/merge-pdf.png',
    from: 'PDFs',
    to: 'PDF',
    acceptTypes: '.pdf',
  },
  {
    id: 'split-pdf',
    title: '拆分PDF',
    description: '将PDF拆分为多个文件',
    image: '/split-pdf.png',
    from: 'PDF',
    to: 'PDFs',
    acceptTypes: '.pdf',
  },
];

export default function ConversionTools() {
  const [selectedTool, setSelectedTool] = useState<ConversionTool | null>(null);
  const [files, setFiles] = useState<FileState[]>([]);
  const [status, setStatus] = useState<ConversionStatus>({
    isConverting: false,
    progress: 0,
    error: null,
    result: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && selectedTool) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  }, [selectedTool]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const convertFiles = async () => {
    if (files.length === 0 || !selectedTool) return;

    setStatus({
      isConverting: true,
      progress: 0,
      error: null,
      result: null,
    });

    try {
      setStatus((prev) => ({ ...prev, progress: 10 }));
      const { PDFDocument } = await import('pdf-lib');
      setStatus((prev) => ({ ...prev, progress: 30 }));

      switch (selectedTool.id) {
        case 'merge-pdf':
          await mergePDFs(PDFDocument);
          break;
        case 'jpg-to-pdf':
          await imagesToPDF(PDFDocument);
          break;
        case 'pdf-to-word':
          await pdfToWord();
          break;
        case 'pdf-to-excel':
          await pdfToExcel();
          break;
        case 'pdf-to-ppt':
          await pdfToPPT();
          break;
        case 'word-to-pdf':
        case 'excel-to-pdf':
        case 'ppt-to-pdf':
          await otherToPDF(PDFDocument);
          break;
        case 'pdf-to-jpg':
          await pdfToJPG();
          break;
        case 'split-pdf':
          await splitPDF(PDFDocument);
          break;
        default:
          await createSamplePDF(PDFDocument);
      }

      setStatus((prev) => ({
        ...prev,
        isConverting: false,
        progress: 100,
      }));
    } catch (error: any) {
      console.error('Conversion error:', error);
      const errorMessage = error?.message || '转换过程中出现错误，请重试';
      setStatus({
        isConverting: false,
        progress: 0,
        error: errorMessage,
        result: null,
      });
    }
  };

  const mergePDFs = async (PDFDocument: any) => {
    const mergedPdf = await PDFDocument.create();
    for (const fileState of files) {
      if (fileState.file) {
        const arrayBuffer = await fileState.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page: unknown) => mergedPdf.addPage(page));
      }
    }
    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    setStatus((prev) => ({ ...prev, progress: 100, result: blob }));
  };

  const imagesToPDF = async (PDFDocument: any) => {
    const pdfDoc = await PDFDocument.create();
    for (const fileState of files) {
      if (fileState.file && fileState.file.type.startsWith('image/')) {
        const imageData = await fileState.file.arrayBuffer();
        let image;
        if (fileState.file.type === 'image/png') {
          image = await pdfDoc.embedPng(imageData);
        } else {
          image = await pdfDoc.embedJpg(imageData);
        }
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    setStatus((prev) => ({ ...prev, progress: 100, result: blob }));
  };

  const extractTextFromPDF = async (file: File): Promise<{ text: string; pageNum: number }[]> => {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      standardFontDataUrl: undefined
    });
    
    const pdf = await loadingTask.promise;
    const results: { text: string; pageNum: number }[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items as Array<{ str?: string; hasEOL?: boolean }>;
        
        // 更好的文本提取逻辑，保留换行和空格
        let pageText = '';
        for (let j = 0; j < items.length; j++) {
          const item = items[j];
          if (item.str) {
            pageText += item.str;
          }
          if (item.hasEOL || (j < items.length - 1 && items[j + 1].hasEOL)) {
            pageText += '\n';
          } else if (j < items.length - 1) {
            pageText += ' ';
          }
        }
        
        // 清理多余空格，但保留换行
        pageText = pageText
          .split('\n')
          .map(line => line.replace(/\s+/g, ' ').trim())
          .filter(line => line.length > 0)
          .join('\n');
        
        results.push({ text: pageText || `[Page ${i}: No extractable text]`, pageNum: i });
      } catch (pageError) {
        console.error(`Error extracting text from page ${i}:`, pageError);
        results.push({ text: `[Page ${i}: Error extracting text]`, pageNum: i });
      }
    }
    
    return results;
  };

  const pdfToWord = async () => {
    const { Document, Paragraph, TextRun, Packer } = await import('docx');
    const children: any[] = [
      new Paragraph({
        children: [new TextRun({ text: 'PDF to Word Conversion', bold: true, size: 32 })],
        spacing: { after: 300 },
      }),
    ];

    setStatus((prev) => ({ ...prev, progress: 50 }));

    for (const fileState of files) {
      if (fileState.file) {
        const pageTexts = await extractTextFromPDF(fileState.file);
        
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `File: ${fileState.name}`, bold: true, size: 28 })],
            spacing: { after: 200 },
          })
        );
        
        for (const { text, pageNum } of pageTexts) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `--- Page ${pageNum} ---`, italics: true, size: 20 })],
              spacing: { before: 200, after: 100 },
            })
          );
          
          const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
          if (paragraphs.length === 0 || text.includes('No extractable text')) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: text, italics: true, size: 20, color: '999999' })],
                spacing: { after: 200 },
              })
            );
          } else {
            for (const para of paragraphs) {
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: para, size: 22 })],
                  spacing: { after: 120 },
                })
              );
            }
          }
        }
      }
    }

    const doc = new Document({ sections: [{ properties: {}, children }] });
    const blob = await Packer.toBlob(doc);
    setStatus((prev) => ({ ...prev, progress: 100, result: blob }));
  };

  const pdfToExcel = async () => {
    let csvContent = 'File,Page,Content\n';

    for (const fileState of files) {
      if (fileState.file) {
        const pageTexts = await extractTextFromPDF(fileState.file);
        for (const { text, pageNum } of pageTexts) {
          const escapedText = text.replace(/"/g, '""');
          csvContent += `"${fileState.name}",${pageNum},"${escapedText}"\n`;
        }
      }
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    setStatus((prev) => ({ ...prev, progress: 100, result: blob }));
  };

  const pdfToPPT = async () => {
    // Use pptxgenjs library to create proper PPTX files
    const PptxGenJS = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.title = 'PDF to Presentation';
    pptx.author = 'PDF Converter';
    
    let slideCount = 0;
    
    for (const fileState of files) {
      if (fileState.file) {
        const pageTexts = await extractTextFromPDF(fileState.file);
        
        for (const { text, pageNum } of pageTexts) {
          // Create a new slide
          const slide = pptx.addSlide();
          
          // Add title
          slide.addText(`Slide ${pageNum} - ${fileState.name}`, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 1,
            fontSize: 24,
            bold: true,
            color: '363636',
            align: 'center'
          });
          
          // Add content text
          // Split text into paragraphs for better formatting
          const paragraphs = text.split('\n').filter(p => p.trim());
          
          if (paragraphs.length > 0) {
            // Add paragraphs as bullet points
            const bulletItems = paragraphs.map(p => ({
              text: p.trim(),
              options: {
                fontSize: 14,
                color: '666666',
                breakLine: true
              }
            }));
            
            slide.addText(bulletItems, {
              x: 0.5,
              y: 1.8,
              w: 9,
              h: 4,
              bullet: true
            });
          } else {
            // If no paragraphs, add the raw text
            slide.addText(text || 'No content extracted', {
              x: 0.5,
              y: 1.8,
              w: 9,
              h: 4,
              fontSize: 14,
              color: '666666',
              valign: 'top'
            });
          }
          
          slideCount++;
        }
      }
    }
    
    // Generate the PPTX file
    const blob = await pptx.write({ outputType: 'blob' }) as Blob;
    setStatus((prev) => ({ ...prev, progress: 100, result: blob }));
  };

  const pdfToJPG = async () => {
    // PDF to JPG requires rendering the PDF to canvas
    // We'll use pdf.js to render each page to a canvas and then convert to JPG
    
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
    
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    let imageCount = 0;

    for (const fileState of files) {
      if (fileState.file) {
        const arrayBuffer = await fileState.file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ 
          data: arrayBuffer,
          useSystemFonts: true,
          standardFontDataUrl: undefined
        });
        const pdf = await loadingTask.promise;
        
        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            const page = await pdf.getPage(i);
            const scale = 2.0; // Higher quality
            const viewport = page.getViewport({ scale });
            
            // Create canvas with proper dimensions
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
              console.error('Failed to get canvas context');
              continue;
            }
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // Fill white background (important for JPG)
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            // Render page to canvas
            await page.render({ 
              canvasContext: context, 
              viewport: viewport,
              canvas: canvas as HTMLCanvasElement
            }).promise;
            
            // Convert to JPG with high quality
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            
            // Parse base64 data
            const base64Data = dataUrl.split(',')[1];
            if (!base64Data) {
              console.error('Failed to get base64 data');
              continue;
            }
            
            // Convert base64 to binary using a more robust method
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let j = 0; j < binaryString.length; j++) {
              bytes[j] = binaryString.charCodeAt(j);
            }
            
            // Add to zip with proper filename - use binary data directly
            const fileName = `page_${String(i).padStart(3, '0')}.jpg`;
            zip.file(fileName, bytes, { binary: true });
            imageCount++;
            
            console.log(`Successfully converted page ${i} to JPG, size: ${bytes.length} bytes`);
          } catch (error) {
            console.error(`Error converting page ${i}:`, error);
          }
        }
      }
    }

    if (imageCount === 0) {
      throw new Error('Failed to convert any pages to JPG');
    }

    // Always return as zip for consistency
    const blob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    setStatus((prev) => ({ ...prev, progress: 100, result: blob }));
  };

  const otherToPDF = async (_PDFDocument: any) => {
    // 使用html2canvas + jspdf处理Excel转PDF，支持中文
    const { default: jsPDF } = await import('jspdf');
    const html2canvas = await import('html2canvas');
    const XLSX = await import('xlsx');
    
    const doc = new jsPDF();
    const pageHeight = 280; // A4页面可用高度（mm）
    const margin = 20; // 页面边距（mm）
    
    for (const fileState of files) {
      if (fileState.file) {
        try {
          // 读取Excel文件
          const arrayBuffer = await fileState.file.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          
          // 遍历所有工作表
          for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
            
            if (jsonData.length === 0) continue;
            
            // 创建临时HTML容器来渲染表格
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '794px'; // A4 width in pixels at 96 DPI
            container.style.padding = '20px';
            container.style.fontFamily = 'Arial, sans-serif';
            container.style.fontSize = '10px';
            container.style.backgroundColor = 'white';
            
            // 创建表格标题
            const title = document.createElement('h2');
            title.textContent = `Sheet: ${sheetName}`;
            title.style.marginBottom = '10px';
            title.style.fontSize = '16px';
            container.appendChild(title);
            
            // 创建HTML表格
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.fontSize = '10px';
            
            // 创建表头
            if (jsonData.length > 0) {
              const thead = document.createElement('thead');
              const headerRow = document.createElement('tr');
              headerRow.style.backgroundColor = '#428bca';
              headerRow.style.color = 'white';
              headerRow.style.fontWeight = 'bold';
              
              for (const cell of jsonData[0]) {
                const th = document.createElement('th');
                th.style.border = '1px solid #ddd';
                th.style.padding = '6px';
                th.style.textAlign = 'left';
                th.textContent = String(cell || '');
                headerRow.appendChild(th);
              }
              
              thead.appendChild(headerRow);
              table.appendChild(thead);
            }
            
            // 创建表格内容
            if (jsonData.length > 1) {
              const tbody = document.createElement('tbody');
              
              for (let i = 1; i < jsonData.length; i++) {
                const row = document.createElement('tr');
                
                for (const cell of jsonData[i]) {
                  const td = document.createElement('td');
                  td.style.border = '1px solid #ddd';
                  td.style.padding = '4px';
                  td.textContent = String(cell || '');
                  row.appendChild(td);
                }
                
                tbody.appendChild(row);
              }
              
              table.appendChild(tbody);
            }
            
            container.appendChild(table);
            document.body.appendChild(container);
            
            try {
              // 使用html2canvas将HTML转换为图片
              const canvas = await html2canvas.default(container, {
                scale: 2, // 提高清晰度
                useCORS: true,
                logging: false
              });
              
              const imgWidth = 170; // A4 width in mm minus margins
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              // 如果不是第一个工作表，添加新页面
              if (workbook.SheetNames.indexOf(sheetName) > 0) {
                doc.addPage();
              }
              
              // 计算需要分多少页
              const totalPages = Math.ceil(imgHeight / pageHeight);
              
              for (let page = 0; page < totalPages; page++) {
                // 如果不是第一页，添加新页面
                if (page > 0) {
                  doc.addPage();
                }
                
                // 计算当前页的图片位置和高度
                const yOffset = page * pageHeight;
                const remainingHeight = imgHeight - yOffset;
                const currentHeight = Math.min(remainingHeight, pageHeight);
                
                // 创建裁剪后的图片
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = (currentHeight * canvas.height) / imgHeight;
                const ctx = tempCanvas.getContext('2d');
                
                if (ctx) {
                  // 从原始canvas中裁剪当前页的内容
                  const sourceY = (yOffset * canvas.height) / imgHeight;
                  const sourceHeight = (currentHeight * canvas.height) / imgHeight;
                  ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, tempCanvas.width, tempCanvas.height);
                  
                  const croppedImgData = tempCanvas.toDataURL('image/png');
                  
                  // 将图片添加到PDF
                  doc.addImage(croppedImgData, 'PNG', margin, margin, imgWidth, currentHeight);
                }
              }
              
            } finally {
              // 清理临时DOM元素
              document.body.removeChild(container);
            }
          }
        } catch (error) {
          console.error('Error processing Excel file:', error);
          // 如果处理失败，创建一个简单的信息页面
          doc.addPage();
          doc.setFontSize(14);
          doc.text(`File: ${fileState.name}`, 14, 20);
          doc.setFontSize(12);
          doc.text(`Size: ${formatFileSize(fileState.size)}`, 14, 30);
          doc.setFontSize(10);
          doc.text('Error: Could not read Excel file content', 14, 40);
        }
      }
    }

    const pdfBytes = doc.output('arraybuffer');
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    setStatus((prev) => ({ ...prev, progress: 100, result: blob }));
  };

  const splitPDF = async (PDFDocument: any) => {
    const fileState = files[0];
    if (!fileState?.file) return;

    const arrayBuffer = await fileState.file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pageCount = pdf.getPageCount();
    
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Split into individual pages
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(copiedPage);
      const pdfBytes = await newPdf.save();
      zip.file(`page_${String(i + 1).padStart(3, '0')}.pdf`, pdfBytes);
    }

    if (pageCount === 1) {
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setStatus((prev) => ({ ...prev, progress: 100, result: blob }));
    } else {
      const blob = await zip.generateAsync({ 
        type: 'blob', 
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
        mimeType: 'application/zip'
      });
      setStatus((prev) => ({ ...prev, progress: 100, result: blob }));
    }
  };

  const createSamplePDF = async (PDFDocument: any) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height } = page.getSize();

    // 避免中文字符编码问题
    const safeFrom = selectedTool?.from?.replace(/[^\x00-\x7F]/g, '?') || 'Unknown';
    const safeTo = selectedTool?.to?.replace(/[^\x00-\x7F]/g, '?') || 'Unknown';
    const safeFileNames = files.map(f => f.name.replace(/[^\x00-\x7F]/g, '?')).join(', ');

    page.drawText(`Converted from ${safeFrom} to ${safeTo}`, { x: 50, y: height - 100, size: 20 });
    page.drawText(`Files: ${safeFileNames}`, { x: 50, y: height - 150, size: 12 });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    setStatus((prev) => ({ ...prev, progress: 100, result: blob }));
  };

  const downloadResult = () => {
    if (status.result && selectedTool) {
      const timestamp = Date.now();
      let fileName: string;

      switch (selectedTool.id) {
        case 'pdf-to-word':
          fileName = `converted_${timestamp}.docx`;
          break;
        case 'pdf-to-excel':
          fileName = `converted_${timestamp}.csv`;
          break;
        case 'pdf-to-ppt':
          fileName = `converted_${timestamp}.pptx`;
          break;
        case 'pdf-to-jpg':
          fileName = `converted_${timestamp}.zip`;
          break;
        case 'split-pdf':
          fileName = `split_${timestamp}.zip`;
          break;
        default:
          fileName = `converted_${timestamp}.pdf`;
      }

      const url = URL.createObjectURL(status.result);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const openTool = (tool: ConversionTool) => {
    setSelectedTool(tool);
    setFiles([]);
    setStatus({ isConverting: false, progress: 0, error: null, result: null });
    setIsDialogOpen(true);
  };

  return (
    <section id="tools" className="py-24 bg-[#f4f6ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">强大的PDF转换工具</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">支持多种格式互转，满足您的各种文档处理需求</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => openTool(tool)}
              className="group bg-white rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-[#6b8cff]/20"
            >
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img src={tool.image} alt={tool.title} className="w-full aspect-square object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-semibold text-gray-900 text-center mb-1 group-hover:text-[#6b8cff] transition-colors">{tool.title}</h3>
              <p className="text-xs text-gray-500 text-center line-clamp-2">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedTool && (
                <>
                  <img src={selectedTool.image} alt={selectedTool.title} className="w-10 h-10 object-contain" />
                  <span>{selectedTool.title}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {!status.isConverting && !status.result && (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive ? 'border-[#6b8cff] bg-blue-50' : 'border-gray-300 hover:border-[#6b8cff] hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={selectedTool?.id === 'merge-pdf' || selectedTool?.id === 'jpg-to-pdf'}
                  accept={selectedTool?.acceptTypes}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">拖放文件到这里</p>
                <p className="text-sm text-gray-500">或点击选择文件，支持 {selectedTool?.acceptTypes}</p>
              </div>
            )}

            {files.length > 0 && !status.isConverting && !status.result && (
              <div className="mt-4 space-y-2">
                {files.map((file, fileIdx) => (
                  <div key={fileIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#6b8cff]" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(fileIdx)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {status.isConverting && (
              <div className="py-8 text-center">
                <Loader2 className="w-12 h-12 text-[#6b8cff] animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-4">正在转换中...</p>
                <Progress value={status.progress} className="w-full" />
                <p className="text-sm text-gray-500 mt-2">{status.progress}%</p>
              </div>
            )}

            {status.error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p>{status.error}</p>
              </div>
            )}

            {status.result && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">转换成功！</p>
                <p className="text-sm text-gray-500 mb-4">
                  文件格式: {selectedTool?.to || 'PDF'}
                </p>
                <Button onClick={downloadResult} className="bg-gradient-to-r from-[#6b8cff] to-[#a3b7ff] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  下载文件
                </Button>
              </div>
            )}

            {files.length > 0 && !status.isConverting && !status.result && (
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => { setFiles([]); setStatus({ isConverting: false, progress: 0, error: null, result: null }); }}>
                  清除
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-[#6b8cff] to-[#a3b7ff] text-white" onClick={convertFiles}>
                  开始转换
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
