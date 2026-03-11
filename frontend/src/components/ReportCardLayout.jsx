<<<<<<< HEAD
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import MarksTable from './MarksTable';
import StudentInfo from './StudentInfo';

function ReportCardLayout({ reportData, onBack }) {
  const reportRef = useRef(null);

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: reportRef.current.scrollWidth,
      windowHeight: reportRef.current.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    pdf.save(`${reportData.studentName}-report-card.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="no-print flex w-full max-w-[210mm] items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-slate-500 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
        >
          Back to Form
        </button>
      </div>

      <article
        ref={reportRef}
        className="print-surface w-full max-w-[210mm] bg-white p-3 text-black shadow-lg"
        style={{ minHeight: '297mm' }}
      >
        <div className="relative border border-red-700">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <img
              src="/school.jpeg"
              alt="School watermark"
               className="h-auto w-[60%] object-contain opacity-[0.10]"
            />
          </div>

          <div className="relative z-10">
          <header className="grid grid-cols-[82px_1fr] border-b border-red-700">
            <div className="flex items-center justify-center border-r border-red-700 p-2 text-center text-[10px] font-semibold">
              <img
                src="/school.jpeg"
                alt="School logo"
                className="h-[64px] w-[64px] rounded-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="px-2 py-2 text-center">
              <h1 className="text-[34px] font-bold uppercase leading-none text-blue-900">
                {reportData.schoolName}
              </h1>
              <p className="text-[16px] font-semibold text-slate-800">{reportData.schoolAddress}</p>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span>Department of Education, Rajasthan</span>
                <span>{reportData.diseCode}</span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-[1fr_200px] border-b border-red-700">
            <div className="border-r border-red-700 p-2 text-center text-[52px] leading-none text-blue-700">
              Final Report Card
            </div>
            <div className="p-2 text-[16px] font-semibold text-red-700">
              <p>
                Roll No.: <span className="text-slate-900">{reportData.rollNumber}</span>
              </p>
              <p className="mt-4 text-[14px] text-slate-900">Session: {reportData.session}</p>
            </div>
          </div>

          <StudentInfo reportData={reportData} />

          <MarksTable subjects={reportData.subjects} />

          <section className="border-t border-red-700">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className="border border-red-700 px-2 py-1 text-left text-red-700" colSpan={7}>
                    Overall Result
                  </th>
                </tr>
                <tr>
                  <th className="border border-red-700 px-1 py-1">Total Max. Marks</th>
                  <th className="border border-red-700 px-1 py-1">Total Obtained Marks</th>
                  <th className="border border-red-700 px-1 py-1">Percentage</th>
                  <th className="border border-red-700 px-1 py-1">Overall Div.</th>
                  <th className="border border-red-700 px-1 py-1">Overall Grade</th>
                  <th className="border border-red-700 px-1 py-1">Result</th>
                  <th className="border border-red-700 px-1 py-1">Position In Class</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.totalMaxMarks}
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.totalObtainedMarks}
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.percentage}%
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.overallDivision}
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.overallGrade}
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.result}
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.positionInClass}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="grid grid-cols-[1fr_1fr] border-t border-red-700">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="border border-red-700 px-2 py-1 text-red-700" colSpan={3}>
                      Extra Subjects
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-red-700 px-2 py-1">Subject</th>
                    <th className="border border-red-700 px-2 py-1">Obtained Total Marks</th>
                    <th className="border border-red-700 px-2 py-1">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.extraSubjects.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td className="border border-red-700 px-2 py-1">{item.name}</td>
                      <td className="border border-red-700 px-2 py-1 text-center">{item.obtainedMarks}</td>
                      <td className="border border-red-700 px-2 py-1 text-center">{item.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="w-full border-collapse text-[11px]">
                <tbody>
                  <tr>
                    <td className="border border-red-700 px-2 py-1 font-semibold text-red-700">
                      Total Meetings:
                    </td>
                    <td className="border border-red-700 px-2 py-1">{reportData.totalMeetings}</td>
                  </tr>
                  <tr>
                    <td className="border border-red-700 px-2 py-1 font-semibold text-red-700">
                      Student Meetings:
                    </td>
                    <td className="border border-red-700 px-2 py-1">{reportData.studentMeetings}</td>
                  </tr>
                  <tr>
                    <td className="border border-red-700 px-2 py-1 font-semibold text-red-700">
                      Attendance Percentage
                    </td>
                    <td className="border border-red-700 px-2 py-1">{reportData.attendancePercentage}%</td>
                  </tr>
                  <tr>
                    <td className="border border-red-700 px-2 py-1 font-semibold text-red-700">Remark:</td>
                    <td className="border border-red-700 px-2 py-1">{reportData.remark}</td>
                  </tr>
                  <tr>
                    <td className="border border-red-700 px-2 py-1 font-semibold text-red-700">
                      Result Date:
                    </td>
                    <td className="border border-red-700 px-2 py-1">{reportData.resultDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-[42%_58%] border-t border-red-700">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="border border-red-700 px-1 py-1 text-red-700" colSpan={3}>
                      Grading System
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-red-700 px-1 py-1">Grade</th>
                    <th className="border border-red-700 px-1 py-1">% Range</th>
                    <th className="border border-red-700 px-1 py-1">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.gradingSystem.map((item) => (
                    <tr key={item.grade}>
                      <td className="border border-red-700 px-1 py-1 text-center">{item.grade}</td>
                      <td className="border border-red-700 px-1 py-1 text-center">{item.range}</td>
                      <td className="border border-red-700 px-1 py-1">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col justify-between border-l border-red-700 p-2 text-[11px]">
                <p className="text-center">
                  <span className="font-semibold">Signature with class teacher</span>
                </p>
                <p className="text-center">Signature and seal of Principal / HM</p>
                <p className="text-right font-semibold">Wish bright future</p>
              </div>
            </div>
          </section>
          </div>
        </div>

        <section className="mt-2 grid grid-cols-3 gap-4 text-center text-[11px]">
          <div>
            <div className="mb-6 border-b border-red-700" />
            Class Teacher
          </div>
          <div>
            <div className="mb-6 border-b border-red-700" />
            Exam Incharge
          </div>
          <div>
            <div className="mb-6 border-b border-red-700" />
            Principal
          </div>
        </section>
      </article>

      <div className="no-print flex w-full max-w-[210mm] justify-end gap-2">
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="rounded border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
        >
          Print Report Card
        </button>
      </div>
    </div>
  );
}

export default ReportCardLayout;
=======
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import MarksTable from './MarksTable';
import StudentInfo from './StudentInfo';

function ReportCardLayout({ reportData, onBack }) {
  const reportRef = useRef(null);

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: reportRef.current.scrollWidth,
      windowHeight: reportRef.current.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    pdf.save(`${reportData.studentName}-report-card.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="no-print flex w-full max-w-[210mm] items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-slate-500 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
        >
          Back to Form
        </button>
      </div>

      <article
        ref={reportRef}
        className="print-surface w-full max-w-[210mm] bg-white p-3 text-black shadow-lg"
        style={{ minHeight: '297mm' }}
      >
        <div className="relative border border-red-700">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <img
              src="/school.jpeg"
              alt="School watermark"
               className="h-auto w-[60%] object-contain opacity-[0.10]"
            />
          </div>

          <div className="relative z-10">
          <header className="grid grid-cols-[82px_1fr] border-b border-red-700">
            <div className="flex items-center justify-center border-r border-red-700 p-2 text-center text-[10px] font-semibold">
              <img
                src="/school.jpeg"
                alt="School logo"
                className="h-[64px] w-[64px] rounded-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="px-2 py-2 text-center">
              <h1 className="text-[34px] font-bold uppercase leading-none text-blue-900">
                {reportData.schoolName}
              </h1>
              <p className="text-[16px] font-semibold text-slate-800">{reportData.schoolAddress}</p>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span>Department of Education, Rajasthan</span>
                <span>{reportData.diseCode}</span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-[1fr_200px] border-b border-red-700">
            <div className="border-r border-red-700 p-2 text-center text-[52px] leading-none text-blue-700">
              Final Report Card
            </div>
            <div className="p-2 text-[16px] font-semibold text-red-700">
              <p>
                Roll No.: <span className="text-slate-900">{reportData.rollNumber}</span>
              </p>
              <p className="mt-4 text-[14px] text-slate-900">Session: {reportData.session}</p>
            </div>
          </div>

          <StudentInfo reportData={reportData} />

          <MarksTable subjects={reportData.subjects} />

          <section className="border-t border-red-700">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className="border border-red-700 px-2 py-1 text-left text-red-700" colSpan={7}>
                    Overall Result
                  </th>
                </tr>
                <tr>
                  <th className="border border-red-700 px-1 py-1">Total Max. Marks</th>
                  <th className="border border-red-700 px-1 py-1">Total Obtained Marks</th>
                  <th className="border border-red-700 px-1 py-1">Percentage</th>
                  <th className="border border-red-700 px-1 py-1">Overall Div.</th>
                  <th className="border border-red-700 px-1 py-1">Overall Grade</th>
                  <th className="border border-red-700 px-1 py-1">Result</th>
                  <th className="border border-red-700 px-1 py-1">Position In Class</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.totalMaxMarks}
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.totalObtainedMarks}
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.percentage}%
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.overallDivision}
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.overallGrade}
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.result}
                  </td>
                  <td className="border border-red-700 px-1 py-1 text-center">
                    {reportData.overallResult.positionInClass}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="grid grid-cols-[1fr_1fr] border-t border-red-700">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="border border-red-700 px-2 py-1 text-red-700" colSpan={3}>
                      Extra Subjects
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-red-700 px-2 py-1">Subject</th>
                    <th className="border border-red-700 px-2 py-1">Obtained Total Marks</th>
                    <th className="border border-red-700 px-2 py-1">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.extraSubjects.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td className="border border-red-700 px-2 py-1">{item.name}</td>
                      <td className="border border-red-700 px-2 py-1 text-center">{item.obtainedMarks}</td>
                      <td className="border border-red-700 px-2 py-1 text-center">{item.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="w-full border-collapse text-[11px]">
                <tbody>
                  <tr>
                    <td className="border border-red-700 px-2 py-1 font-semibold text-red-700">
                      Total Meetings:
                    </td>
                    <td className="border border-red-700 px-2 py-1">{reportData.totalMeetings}</td>
                  </tr>
                  <tr>
                    <td className="border border-red-700 px-2 py-1 font-semibold text-red-700">
                      Student Meetings:
                    </td>
                    <td className="border border-red-700 px-2 py-1">{reportData.studentMeetings}</td>
                  </tr>
                  <tr>
                    <td className="border border-red-700 px-2 py-1 font-semibold text-red-700">
                      Attendance Percentage
                    </td>
                    <td className="border border-red-700 px-2 py-1">{reportData.attendancePercentage}%</td>
                  </tr>
                  <tr>
                    <td className="border border-red-700 px-2 py-1 font-semibold text-red-700">Remark:</td>
                    <td className="border border-red-700 px-2 py-1">{reportData.remark}</td>
                  </tr>
                  <tr>
                    <td className="border border-red-700 px-2 py-1 font-semibold text-red-700">
                      Result Date:
                    </td>
                    <td className="border border-red-700 px-2 py-1">{reportData.resultDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-[42%_58%] border-t border-red-700">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="border border-red-700 px-1 py-1 text-red-700" colSpan={3}>
                      Grading System
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-red-700 px-1 py-1">Grade</th>
                    <th className="border border-red-700 px-1 py-1">% Range</th>
                    <th className="border border-red-700 px-1 py-1">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.gradingSystem.map((item) => (
                    <tr key={item.grade}>
                      <td className="border border-red-700 px-1 py-1 text-center">{item.grade}</td>
                      <td className="border border-red-700 px-1 py-1 text-center">{item.range}</td>
                      <td className="border border-red-700 px-1 py-1">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col justify-between border-l border-red-700 p-2 text-[11px]">
                <p className="text-center">
                  <span className="font-semibold">Signature with class teacher</span>
                </p>
                <p className="text-center">Signature and seal of Principal / HM</p>
                <p className="text-right font-semibold">Wish bright future</p>
              </div>
            </div>
          </section>
          </div>
        </div>

        <section className="mt-2 grid grid-cols-3 gap-4 text-center text-[11px]">
          <div>
            <div className="mb-6 border-b border-red-700" />
            Class Teacher
          </div>
          <div>
            <div className="mb-6 border-b border-red-700" />
            Exam Incharge
          </div>
          <div>
            <div className="mb-6 border-b border-red-700" />
            Principal
          </div>
        </section>
      </article>

      <div className="no-print flex w-full max-w-[210mm] justify-end gap-2">
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="rounded border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
        >
          Print Report Card
        </button>
      </div>
    </div>
  );
}

export default ReportCardLayout;
>>>>>>> ed0cc00c47b55670134b48d0f5650fb644776df4
