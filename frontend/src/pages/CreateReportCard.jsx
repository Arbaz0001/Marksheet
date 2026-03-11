<<<<<<< HEAD
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ReportCardLayout from '../components/ReportCardLayout';
import api from '../api';

const subjectNames = ['Hindi', 'English', 'Sanskrit', 'EVS / Social Science', 'Social Science'];

const createDefaultSubject = (name = '') => ({
  name,
  maxMarks: 100,
  firstTest: 0,
  secondTest: 0,
  thirdTest: 0,
  testTotal: 0,
  halfYearly: 0,
  testPlusHYTotal: 0,
  yearlyExam: 0,
  grandTotal: 0,
  divisionDescription: '',
});

const defaultSubjects = subjectNames.map((name) => createDefaultSubject(name));

const createDefaultExtraSubject = (name = '') => ({ name, obtainedMarks: 0, grade: 'A' });

const defaultExtraSubjects = [
  createDefaultExtraSubject('Work Experience'),
  createDefaultExtraSubject('Art Education'),
  createDefaultExtraSubject('Health & Physical Education'),
];

const gradingSystem = [
  { grade: 'A', range: '86-100', description: 'Excellent' },
  { grade: 'B', range: '71-85', description: 'Very Good' },
  { grade: 'C', range: '51-70', description: 'Good' },
  { grade: 'D', range: '31-50', description: 'Average' },
  { grade: 'E', range: '0-30', description: 'Need Improvement' },
];

const getDivisionDescription = (marks) => {
  if (marks >= 86) return 'Excellent';
  if (marks >= 71) return 'Very Good';
  if (marks >= 51) return 'Good';
  if (marks >= 31) return 'Average';
  return 'Need Improvement';
};

const getOverallGrade = (percentage) => {
  if (percentage >= 86) return 'A';
  if (percentage >= 71) return 'B';
  if (percentage >= 51) return 'C';
  if (percentage >= 31) return 'D';
  return 'E';
};

const getInitialState = () => ({
  schoolName: '',
  schoolAddress: '',
  session: '',
  diseCode: '',
  studentName: '',
  scholarNumber: '',
  fatherName: '',
  classSection: '',
  dateOfBirth: '',
  rollNumber: '',
  subjects: defaultSubjects,
  extraSubjects: defaultExtraSubjects,
  totalMeetings: 0,
  studentMeetings: 0,
  remark: '',
  resultDate: '',
  attendancePercentage: 0,
  positionInClass: '',
});

function CreateReportCard() {
  const [form, setForm] = useState(getInitialState());
  const [reportData, setReportData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const computedResult = useMemo(() => {
    const subjects = form.subjects.map((subject) => {
      const testTotal = Number(subject.firstTest) + Number(subject.secondTest) + Number(subject.thirdTest);
      const testPlusHYTotal = testTotal + Number(subject.halfYearly);
      const grandTotal = testPlusHYTotal + Number(subject.yearlyExam);
      return {
        ...subject,
        testTotal,
        testPlusHYTotal,
        grandTotal,
        divisionDescription: getDivisionDescription(grandTotal),
      };
    });

    const totalMaxMarks = subjects.reduce((sum, item) => sum + Number(item.maxMarks), 0);
    const totalObtainedMarks = subjects.reduce((sum, item) => sum + Number(item.grandTotal), 0);
    const percentage = totalMaxMarks ? Number(((totalObtainedMarks / totalMaxMarks) * 100).toFixed(2)) : 0;
    const overallGrade = getOverallGrade(percentage);
    const overallDivision = getDivisionDescription(percentage);
    const result = percentage >= 31 ? 'Pass' : 'Fail';

    return {
      subjects,
      overallResult: {
        totalMaxMarks,
        totalObtainedMarks,
        percentage,
        overallDivision,
        overallGrade,
        result,
        positionInClass: form.positionInClass,
      },
    };
  }, [form]);

  const handleBasicChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.subjects];
      updated[index] = {
        ...updated[index],
        [field]: field === 'divisionDescription' || field === 'name' ? value : Number(value),
      };
      return { ...prev, subjects: updated };
    });
  };

  const handleExtraChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.extraSubjects];
      updated[index] = {
        ...updated[index],
        [field]: field === 'obtainedMarks' ? Number(value) : value,
      };
      return { ...prev, extraSubjects: updated };
    });
  };

  const handleAddSubject = () => {
    setForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, createDefaultSubject(`Subject ${prev.subjects.length + 1}`)],
    }));
  };

  const handleAddExtraSubject = () => {
    setForm((prev) => ({
      ...prev,
      extraSubjects: [
        ...prev.extraSubjects,
        createDefaultExtraSubject(`Extra Subject ${prev.extraSubjects.length + 1}`),
      ],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const payload = {
      ...form,
      subjects: computedResult.subjects,
      extraSubjects: form.extraSubjects,
      gradingSystem,
      overallResult: computedResult.overallResult,
      totalMeetings: Number(form.totalMeetings),
      studentMeetings: Number(form.studentMeetings),
      attendancePercentage: Number(form.attendancePercentage),
    };

    try {
      setSaving(true);
      const response = await api.post('/report-cards', payload);
      const saved = response.data;
      setReportData(saved);
    } catch (saveError) {
      if (saveError.code === 'ERR_NETWORK') {
        setError('Backend server is not reachable. Please try again later.');
      } else if (saveError.response?.data?.message) {
        setError(saveError.response.data.message);
      } else {
        setError(saveError.message || 'Unable to create report card.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (reportData) {
    return <ReportCardLayout reportData={reportData} onBack={() => setReportData(null)} />;
  }

  return (
    <section className="rounded-xl border border-slate-300 bg-white p-6 shadow-md sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Report Card</h1>
        <Link to="/" className="text-sm font-semibold text-slate-700 underline">
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            ['schoolName', 'School Name'],
            ['schoolAddress', 'School Address'],
            ['session', 'Session'],
            ['diseCode', 'School DISE Code'],
            ['studentName', 'Student Name'],
            ['scholarNumber', 'Scholar Number'],
            ['fatherName', 'Father Name'],
            ['classSection', 'Class & Section'],
            ['dateOfBirth', 'Date of Birth'],
            ['rollNumber', 'Roll Number'],
          ].map(([name, label]) => (
            <label key={name} className="block">
              <span className="mb-1 block text-sm font-semibold">{label}</span>
              <input
                type={name.includes('Date') ? 'date' : 'text'}
                name={name}
                value={form[name]}
                onChange={handleBasicChange}
                className="w-full rounded border border-slate-300 px-3 py-2"
                required
              />
            </label>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Subject Marks</h2>
            <button
              type="button"
              onClick={handleAddSubject}
              className="rounded border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              + Add Subject
            </button>
          </div>
          <table className="w-full min-w-[1200px] border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 px-2 py-2">Subject</th>
                <th className="border border-slate-400 px-2 py-2">Max Marks</th>
                <th className="border border-slate-400 px-2 py-2">First Test</th>
                <th className="border border-slate-400 px-2 py-2">Second Test</th>
                <th className="border border-slate-400 px-2 py-2">Third Test</th>
                <th className="border border-slate-400 px-2 py-2">Half Yearly</th>
                <th className="border border-slate-400 px-2 py-2">Yearly Exam</th>
              </tr>
            </thead>
            <tbody>
              {form.subjects.map((subject, index) => (
                <tr key={`${subject.name}-${index}`}>
                  <td className="border border-slate-400 px-2 py-1">
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1"
                      required
                    />
                  </td>
                  {[
                    ['maxMarks', 100],
                    ['firstTest', 10],
                    ['secondTest', 10],
                    ['thirdTest', 10],
                    ['halfYearly', 35],
                    ['yearlyExam', 35],
                  ].map(([field, fieldMax]) => (
                    <td key={field} className="border border-slate-400 px-2 py-1">
                      <input
                        type="number"
                        min="0"
                        max={fieldMax}
                        value={form.subjects[index][field]}
                        onChange={(e) => handleSubjectChange(index, field, e.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1"
                        required
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Extra Subjects</h2>
            <button
              type="button"
              onClick={handleAddExtraSubject}
              className="rounded border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              + Add Extra Subject
            </button>
          </div>
          <table className="w-full border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 px-2 py-2">Subject</th>
                <th className="border border-slate-400 px-2 py-2">Obtained Marks</th>
                <th className="border border-slate-400 px-2 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {form.extraSubjects.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td className="border border-slate-400 px-2 py-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleExtraChange(index, 'name', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1"
                      required
                    />
                  </td>
                  <td className="border border-slate-400 px-2 py-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.obtainedMarks}
                      onChange={(e) => handleExtraChange(index, 'obtainedMarks', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1"
                      required
                    />
                  </td>
                  <td className="border border-slate-400 px-2 py-1">
                    <select
                      value={item.grade}
                      onChange={(e) => handleExtraChange(index, 'grade', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1"
                    >
                      {['A', 'B', 'C', 'D'].map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            ['totalMeetings', 'Total Meetings'],
            ['studentMeetings', 'Student Meetings'],
            ['attendancePercentage', 'Attendance Percentage'],
            ['positionInClass', 'Position in Class'],
            ['resultDate', 'Result Date'],
          ].map(([name, label]) => (
            <label key={name} className="block">
              <span className="mb-1 block text-sm font-semibold">{label}</span>
              <input
                type={name.includes('Date') ? 'date' : name === 'positionInClass' ? 'text' : 'number'}
                name={name}
                value={form[name]}
                onChange={handleBasicChange}
                className="w-full rounded border border-slate-300 px-3 py-2"
                required
              />
            </label>
          ))}

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold">Remark</span>
            <textarea
              name="remark"
              value={form.remark}
              onChange={handleBasicChange}
              rows={3}
              className="w-full rounded border border-slate-300 px-3 py-2"
              required
            />
          </label>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="w-max rounded bg-slate-900 px-6 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Generate Report Card'}
        </button>
      </form>
    </section>
  );
}

export default CreateReportCard;
=======
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ReportCardLayout from '../components/ReportCardLayout';
import api from '../api';

const subjectNames = ['Hindi', 'English', 'Sanskrit', 'EVS / Social Science', 'Social Science'];

const createDefaultSubject = (name = '') => ({
  name,
  maxMarks: 100,
  firstTest: 0,
  secondTest: 0,
  thirdTest: 0,
  testTotal: 0,
  halfYearly: 0,
  testPlusHYTotal: 0,
  yearlyExam: 0,
  grandTotal: 0,
  divisionDescription: '',
});

const defaultSubjects = subjectNames.map((name) => createDefaultSubject(name));

const createDefaultExtraSubject = (name = '') => ({ name, obtainedMarks: 0, grade: 'A' });

const defaultExtraSubjects = [
  createDefaultExtraSubject('Work Experience'),
  createDefaultExtraSubject('Art Education'),
  createDefaultExtraSubject('Health & Physical Education'),
];

const gradingSystem = [
  { grade: 'A', range: '86-100', description: 'Excellent' },
  { grade: 'B', range: '71-85', description: 'Very Good' },
  { grade: 'C', range: '51-70', description: 'Good' },
  { grade: 'D', range: '31-50', description: 'Average' },
  { grade: 'E', range: '0-30', description: 'Need Improvement' },
];

const getDivisionDescription = (marks) => {
  if (marks >= 86) return 'Excellent';
  if (marks >= 71) return 'Very Good';
  if (marks >= 51) return 'Good';
  if (marks >= 31) return 'Average';
  return 'Need Improvement';
};

const getOverallGrade = (percentage) => {
  if (percentage >= 86) return 'A';
  if (percentage >= 71) return 'B';
  if (percentage >= 51) return 'C';
  if (percentage >= 31) return 'D';
  return 'E';
};

const getInitialState = () => ({
  schoolName: '',
  schoolAddress: '',
  session: '',
  diseCode: '',
  studentName: '',
  scholarNumber: '',
  fatherName: '',
  classSection: '',
  dateOfBirth: '',
  rollNumber: '',
  subjects: defaultSubjects,
  extraSubjects: defaultExtraSubjects,
  totalMeetings: 0,
  studentMeetings: 0,
  remark: '',
  resultDate: '',
  attendancePercentage: 0,
  positionInClass: '',
});

function CreateReportCard() {
  const [form, setForm] = useState(getInitialState());
  const [reportData, setReportData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const computedResult = useMemo(() => {
    const subjects = form.subjects.map((subject) => {
      const testTotal = Number(subject.firstTest) + Number(subject.secondTest) + Number(subject.thirdTest);
      const testPlusHYTotal = testTotal + Number(subject.halfYearly);
      const grandTotal = testPlusHYTotal + Number(subject.yearlyExam);
      return {
        ...subject,
        testTotal,
        testPlusHYTotal,
        grandTotal,
        divisionDescription: getDivisionDescription(grandTotal),
      };
    });

    const totalMaxMarks = subjects.reduce((sum, item) => sum + Number(item.maxMarks), 0);
    const totalObtainedMarks = subjects.reduce((sum, item) => sum + Number(item.grandTotal), 0);
    const percentage = totalMaxMarks ? Number(((totalObtainedMarks / totalMaxMarks) * 100).toFixed(2)) : 0;
    const overallGrade = getOverallGrade(percentage);
    const overallDivision = getDivisionDescription(percentage);
    const result = percentage >= 31 ? 'Pass' : 'Fail';

    return {
      subjects,
      overallResult: {
        totalMaxMarks,
        totalObtainedMarks,
        percentage,
        overallDivision,
        overallGrade,
        result,
        positionInClass: form.positionInClass,
      },
    };
  }, [form]);

  const handleBasicChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.subjects];
      updated[index] = {
        ...updated[index],
        [field]: field === 'divisionDescription' || field === 'name' ? value : Number(value),
      };
      return { ...prev, subjects: updated };
    });
  };

  const handleExtraChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.extraSubjects];
      updated[index] = {
        ...updated[index],
        [field]: field === 'obtainedMarks' ? Number(value) : value,
      };
      return { ...prev, extraSubjects: updated };
    });
  };

  const handleAddSubject = () => {
    setForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, createDefaultSubject(`Subject ${prev.subjects.length + 1}`)],
    }));
  };

  const handleAddExtraSubject = () => {
    setForm((prev) => ({
      ...prev,
      extraSubjects: [
        ...prev.extraSubjects,
        createDefaultExtraSubject(`Extra Subject ${prev.extraSubjects.length + 1}`),
      ],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const payload = {
      ...form,
      subjects: computedResult.subjects,
      extraSubjects: form.extraSubjects,
      gradingSystem,
      overallResult: computedResult.overallResult,
      totalMeetings: Number(form.totalMeetings),
      studentMeetings: Number(form.studentMeetings),
      attendancePercentage: Number(form.attendancePercentage),
    };

    try {
      setSaving(true);
      const response = await api.post('/report-cards', payload);
      const saved = response.data;
      setReportData(saved);
    } catch (saveError) {
      if (saveError.code === 'ERR_NETWORK') {
        setError('Backend server is not reachable. Start backend on http://localhost:5000 and check MongoDB.');
      } else if (saveError.response?.data?.message) {
        setError(saveError.response.data.message);
      } else {
        setError(saveError.message || 'Unable to create report card.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (reportData) {
    return <ReportCardLayout reportData={reportData} onBack={() => setReportData(null)} />;
  }

  return (
    <section className="rounded-xl border border-slate-300 bg-white p-6 shadow-md sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Report Card</h1>
        <Link to="/" className="text-sm font-semibold text-slate-700 underline">
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            ['schoolName', 'School Name'],
            ['schoolAddress', 'School Address'],
            ['session', 'Session'],
            ['diseCode', 'School DISE Code'],
            ['studentName', 'Student Name'],
            ['scholarNumber', 'Scholar Number'],
            ['fatherName', 'Father Name'],
            ['classSection', 'Class & Section'],
            ['dateOfBirth', 'Date of Birth'],
            ['rollNumber', 'Roll Number'],
          ].map(([name, label]) => (
            <label key={name} className="block">
              <span className="mb-1 block text-sm font-semibold">{label}</span>
              <input
                type={name.includes('Date') ? 'date' : 'text'}
                name={name}
                value={form[name]}
                onChange={handleBasicChange}
                className="w-full rounded border border-slate-300 px-3 py-2"
                required
              />
            </label>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Subject Marks</h2>
            <button
              type="button"
              onClick={handleAddSubject}
              className="rounded border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              + Add Subject
            </button>
          </div>
          <table className="w-full min-w-[1200px] border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 px-2 py-2">Subject</th>
                <th className="border border-slate-400 px-2 py-2">Max Marks</th>
                <th className="border border-slate-400 px-2 py-2">First Test</th>
                <th className="border border-slate-400 px-2 py-2">Second Test</th>
                <th className="border border-slate-400 px-2 py-2">Third Test</th>
                <th className="border border-slate-400 px-2 py-2">Half Yearly</th>
                <th className="border border-slate-400 px-2 py-2">Yearly Exam</th>
              </tr>
            </thead>
            <tbody>
              {form.subjects.map((subject, index) => (
                <tr key={`${subject.name}-${index}`}>
                  <td className="border border-slate-400 px-2 py-1">
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1"
                      required
                    />
                  </td>
                  {[
                    ['maxMarks', 100],
                    ['firstTest', 10],
                    ['secondTest', 10],
                    ['thirdTest', 10],
                    ['halfYearly', 35],
                    ['yearlyExam', 35],
                  ].map(([field, fieldMax]) => (
                    <td key={field} className="border border-slate-400 px-2 py-1">
                      <input
                        type="number"
                        min="0"
                        max={fieldMax}
                        value={form.subjects[index][field]}
                        onChange={(e) => handleSubjectChange(index, field, e.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1"
                        required
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Extra Subjects</h2>
            <button
              type="button"
              onClick={handleAddExtraSubject}
              className="rounded border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              + Add Extra Subject
            </button>
          </div>
          <table className="w-full border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 px-2 py-2">Subject</th>
                <th className="border border-slate-400 px-2 py-2">Obtained Marks</th>
                <th className="border border-slate-400 px-2 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {form.extraSubjects.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td className="border border-slate-400 px-2 py-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleExtraChange(index, 'name', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1"
                      required
                    />
                  </td>
                  <td className="border border-slate-400 px-2 py-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.obtainedMarks}
                      onChange={(e) => handleExtraChange(index, 'obtainedMarks', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1"
                      required
                    />
                  </td>
                  <td className="border border-slate-400 px-2 py-1">
                    <select
                      value={item.grade}
                      onChange={(e) => handleExtraChange(index, 'grade', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1"
                    >
                      {['A', 'B', 'C', 'D'].map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            ['totalMeetings', 'Total Meetings'],
            ['studentMeetings', 'Student Meetings'],
            ['attendancePercentage', 'Attendance Percentage'],
            ['positionInClass', 'Position in Class'],
            ['resultDate', 'Result Date'],
          ].map(([name, label]) => (
            <label key={name} className="block">
              <span className="mb-1 block text-sm font-semibold">{label}</span>
              <input
                type={name.includes('Date') ? 'date' : name === 'positionInClass' ? 'text' : 'number'}
                name={name}
                value={form[name]}
                onChange={handleBasicChange}
                className="w-full rounded border border-slate-300 px-3 py-2"
                required
              />
            </label>
          ))}

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold">Remark</span>
            <textarea
              name="remark"
              value={form.remark}
              onChange={handleBasicChange}
              rows={3}
              className="w-full rounded border border-slate-300 px-3 py-2"
              required
            />
          </label>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="w-max rounded bg-slate-900 px-6 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Generate Report Card'}
        </button>
      </form>
    </section>
  );
}

export default CreateReportCard;
>>>>>>> ed0cc00c47b55670134b48d0f5650fb644776df4
