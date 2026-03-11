<<<<<<< HEAD
function MarksTable({ subjects }) {
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
=======
function MarksTable({ subjects }) {
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
>>>>>>> ed0cc00c47b55670134b48d0f5650fb644776df4
