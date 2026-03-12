function StudentInfo({ reportData }) {
  const diseCode = reportData.schoolDISECode || reportData.diseCode || '';

  return (
    <section>
      <table className="w-full border-collapse border border-red-700 text-[12px]">
        <tbody>
          {[
            ['Scholar Number', reportData.scholarNumber],
            ['Student Name', reportData.studentName],
            ["Father's Name", reportData.fatherName],
            ["Mother's Name", reportData.motherName],
            ['Class & Section', reportData.classSection],
            ['Date Of Birth', reportData.dateOfBirth],
            ['DISE Code', diseCode],
          ].map(([label, value]) => (
            <tr key={label}>
              <td className="w-1/3 border border-red-700 px-2 py-1 font-semibold">{label}</td>
              <td className="border border-red-700 px-2 py-1">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default StudentInfo;

 
