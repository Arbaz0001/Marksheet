function MarksTable({ subjects, examStructure }) {
  // New dynamic structure: subjects[i].marks = [{ examName, maxMarks, obtained }]
  const isDynamic = Array.isArray(examStructure) && examStructure.length > 0;

  if (isDynamic) {
    return (
      <section className="overflow-x-auto">
        <table className="w-full border-collapse border border-red-700 text-[11px] leading-tight">
          <thead>
            <tr>
              <th className="border border-red-700 px-1 py-1" rowSpan={2}>
                Subject
              </th>
              {examStructure.map((e) => (
                <th key={e.examName} className="border border-red-700 px-1 py-1">
                  {e.examName}
                </th>
              ))}
              <th className="border border-red-700 px-1 py-1" rowSpan={2}>
                Total
              </th>
              <th className="border border-red-700 px-1 py-1" rowSpan={2}>
                Max
              </th>
              <th className="border border-red-700 px-1 py-1" rowSpan={2}>
                Division
              </th>
            </tr>
            <tr className="text-red-700">
              {examStructure.map((e) => (
                <th key={e.examName} className="border border-red-700 px-1 py-1">
                  {e.maxMarks}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={`${subject.name}-${index}`}>
                <td className="border border-red-700 px-1 py-1 uppercase">{subject.name}</td>
                {(subject.marks || []).map((mark, mi) => (
                  <td key={mi} className="border border-red-700 px-1 py-1 text-center">
                    {mark.obtained}
                  </td>
                ))}
                <td className="border border-red-700 px-1 py-1 text-center font-semibold">
                  {subject.total}
                </td>
                <td className="border border-red-700 px-1 py-1 text-center">{subject.maxTotal}</td>
                <td className="border border-red-700 px-1 py-1">{subject.divisionDescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  // Legacy structure (flat fields: firstTest, secondTest, etc.)
  return (
    <section className="overflow-x-auto">
      <table className="w-full border-collapse border border-red-700 text-[11px] leading-tight">
        <thead>
          <tr>
            <th className="border border-red-700 px-1 py-1" rowSpan={2}>
              Subject
            </th>
            <th className="border border-red-700 px-1 py-1" colSpan={10}>
              Max Marks
            </th>
            <th className="border border-red-700 px-1 py-1" rowSpan={2}>
              Subject Div or Description
            </th>
          </tr>
          <tr>
            <th className="border border-red-700 px-1 py-1">First Test</th>
            <th className="border border-red-700 px-1 py-1">Second Test</th>
            <th className="border border-red-700 px-1 py-1">Third Test</th>
            <th className="border border-red-700 px-1 py-1">Total</th>
            <th className="border border-red-700 px-1 py-1">Half Yearly</th>
            <th className="border border-red-700 px-1 py-1">Total (Test)</th>
            <th className="border border-red-700 px-1 py-1">Yearly Exam</th>
            <th className="border border-red-700 px-1 py-1">Grand Total</th>
            <th className="border border-red-700 px-1 py-1">-</th>
            <th className="border border-red-700 px-1 py-1">-</th>
          </tr>
          <tr className="text-red-700">
            <th className="border border-red-700 px-1 py-1 text-left">&nbsp;</th>
            <th className="border border-red-700 px-1 py-1">10</th>
            <th className="border border-red-700 px-1 py-1">10</th>
            <th className="border border-red-700 px-1 py-1">10</th>
            <th className="border border-red-700 px-1 py-1">30</th>
            <th className="border border-red-700 px-1 py-1">35</th>
            <th className="border border-red-700 px-1 py-1">65</th>
            <th className="border border-red-700 px-1 py-1">35</th>
            <th className="border border-red-700 px-1 py-1">100</th>
            <th className="border border-red-700 px-1 py-1">&nbsp;</th>
            <th className="border border-red-700 px-1 py-1">&nbsp;</th>
            <th className="border border-red-700 px-1 py-1">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={`${subject.name}-${index}`}>
              <td className="border border-red-700 px-1 py-1 uppercase">{subject.name}</td>
              <td className="border border-red-700 px-1 py-1 text-center">{subject.firstTest}</td>
              <td className="border border-red-700 px-1 py-1 text-center">{subject.secondTest}</td>
              <td className="border border-red-700 px-1 py-1 text-center">{subject.thirdTest}</td>
              <td className="border border-red-700 px-1 py-1 text-center">{subject.testTotal}</td>
              <td className="border border-red-700 px-1 py-1 text-center">{subject.halfYearly}</td>
              <td className="border border-red-700 px-1 py-1 text-center">{subject.testPlusHYTotal}</td>
              <td className="border border-red-700 px-1 py-1 text-center">{subject.yearlyExam}</td>
              <td className="border border-red-700 px-1 py-1 text-center">{subject.grandTotal}</td>
              <td className="border border-red-700 px-1 py-1 text-center">&nbsp;</td>
              <td className="border border-red-700 px-1 py-1 text-center">&nbsp;</td>
              <td className="border border-red-700 px-1 py-1">{subject.divisionDescription}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default MarksTable;
