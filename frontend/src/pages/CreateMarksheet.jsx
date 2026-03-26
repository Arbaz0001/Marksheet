import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ReportCardLayout from '../components/ReportCardLayout';
import { getSchools, createMarksheet } from '../api';

const DEFAULT_EXTRA_SUBJECTS = [
  { name: 'Work Experience', obtainedMarks: 0, grade: 'A' },
  { name: 'Art Education', obtainedMarks: 0, grade: 'A' },
  { name: 'Health & Physical Education', obtainedMarks: 0, grade: 'A' },
];

const DEFAULT_GRADING_SYSTEM = [
  { grade: 'A', range: '86-100', description: 'Excellent' },
  { grade: 'B', range: '71-85', description: 'Very Good' },
  { grade: 'C', range: '51-70', description: 'Good' },
  { grade: 'D', range: '31-50', description: 'Average' },
  { grade: 'E', range: '0-30', description: 'Need Improvement' },
];

const buildSubjectsFromStructures = (subjectStructure = [], examStructure = []) =>
  subjectStructure.map((s) => ({
    name: s.name,
    marks: examStructure.map((e) => ({
      examName: e.examName,
      maxMarks: e.maxMarks,
      obtained: 0,
    })),
  }));

const getDivisionDescription = (pct) => {
  if (pct >= 86) return 'Excellent';
  if (pct >= 71) return 'Very Good';
  if (pct >= 51) return 'Good';
  if (pct >= 31) return 'Average';
  return 'Need Improvement';
};

const getOverallGrade = (pct) => {
  if (pct >= 86) return 'A';
  if (pct >= 71) return 'B';
  if (pct >= 51) return 'C';
  if (pct >= 31) return 'D';
  return 'E';
};

const parseRange = (rangeText = '') => {
  const match = String(rangeText)
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const min = Number(match[1]);
  const max = Number(match[2]);
  if (Number.isNaN(min) || Number.isNaN(max)) return null;
  return { min: Math.min(min, max), max: Math.max(min, max) };
};

const normalizeGradingSystem = (gradingSystem) =>
  (Array.isArray(gradingSystem) ? gradingSystem : [])
    .map((item) => ({
      grade: String(item.grade || '').trim(),
      range: String(item.range || '').trim(),
      description: String(item.description || '').trim(),
      parsedRange: parseRange(item.range),
    }))
    .filter((item) => item.grade && item.parsedRange);

const resolveGradeFromSystem = (pct, gradingSystem) => {
  const matched = gradingSystem.find(
    (item) => pct >= item.parsedRange.min && pct <= item.parsedRange.max
  );
  return matched?.grade || '';
};

function CreateMarksheet() {
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const [form, setForm] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    rollNumber: '',
    scholarNumber: '',
    classSection: '',
    dateOfBirth: '',
    positionInClass: '',
    totalMeetings: 0,
    studentMeetings: 0,
    attendancePercentage: 0,
    remark: '',
    resultDate: '',
  });

  const [subjects, setSubjects] = useState([]);
  const [extraSubjects, setExtraSubjects] = useState(DEFAULT_EXTRA_SUBJECTS);
  const [useGradingSystem, setUseGradingSystem] = useState(true);
  const [gradingSystem, setGradingSystem] = useState(DEFAULT_GRADING_SYSTEM);
  const [reportData, setReportData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load school list on mount
  useEffect(() => {
    setLoadingSchools(true);
    getSchools()
      .then((res) => setSchools(res.data))
      .catch(() => setError('Failed to load schools. Ensure the backend is running.'))
      .finally(() => setLoadingSchools(false));
  }, []);

  const handleSchoolChange = (e) => {
    const id = e.target.value;
    const school = schools.find((s) => s._id === id) || null;
    setSelectedSchool(school);
    setSubjects(
      school
        ? buildSubjectsFromStructures(school.subjectStructure || [], school.examStructure || [])
        : []
    );
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMarkFieldChange = (subjectIndex, examIndex, field, value) => {
    setSubjects((prev) =>
      prev.map((sub, si) => {
        if (si !== subjectIndex) return sub;
        const marks = sub.marks.map((mark, mi) => {
          if (mi !== examIndex) return mark;
          const parsedValue = Math.max(Number(value) || 0, 0);

          if (field === 'maxMarks') {
            const maxMarks = parsedValue;
            const obtained = Math.min(mark.obtained, maxMarks);
            return { ...mark, maxMarks, obtained };
          }

          const obtained = Math.min(parsedValue, mark.maxMarks);
          return { ...mark, obtained };
        });
        return { ...sub, marks };
      })
    );
  };

  const handleSubjectNameChange = (index, value) => {
    setSubjects((prev) =>
      prev.map((sub, i) => (i !== index ? sub : { ...sub, name: value }))
    );
  };

  const handleExtraChange = (index, field, value) => {
    setExtraSubjects((prev) =>
      prev.map((item, i) =>
        i !== index
          ? item
          : { ...item, [field]: field === 'obtainedMarks' ? Number(value) : value }
      )
    );
  };

  // Live-computed subject totals
  const normalizedGradingSystem = useMemo(
    () => normalizeGradingSystem(gradingSystem),
    [gradingSystem]
  );

  const computedSubjects = useMemo(
    () =>
      subjects.map((sub) => {
        const total = sub.marks.reduce((sum, m) => sum + m.obtained, 0);
        const maxTotal = sub.marks.reduce((sum, m) => sum + m.maxMarks, 0);
        const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
        return {
          ...sub,
          total,
          maxTotal,
          divisionDescription: getDivisionDescription(pct),
          grade: useGradingSystem
            ? resolveGradeFromSystem(pct, normalizedGradingSystem) || getOverallGrade(pct)
            : '',
        };
      }),
    [subjects, useGradingSystem, normalizedGradingSystem]
  );

  const overallResult = useMemo(() => {
    const totalObtainedMarks = computedSubjects.reduce((sum, s) => sum + s.total, 0);
    const totalMaxMarks = computedSubjects.reduce((sum, s) => sum + s.maxTotal, 0);
    const percentage =
      totalMaxMarks > 0
        ? Number(((totalObtainedMarks / totalMaxMarks) * 100).toFixed(2))
        : 0;
    return {
      totalMaxMarks,
      totalObtainedMarks,
      percentage,
      overallDivision: getDivisionDescription(percentage),
      overallGrade: useGradingSystem
        ? resolveGradeFromSystem(percentage, normalizedGradingSystem) || getOverallGrade(percentage)
        : '',
      result: percentage >= 31 ? 'Pass' : 'Fail',
      positionInClass: form.positionInClass,
    };
  }, [computedSubjects, form.positionInClass, useGradingSystem, normalizedGradingSystem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedSchool) {
      setError('Please select a school.');
      return;
    }

    try {
      setSaving(true);
      const res = await createMarksheet({
        school: selectedSchool._id,
        ...form,
        subjects: computedSubjects,
        extraSubjects,
        useGradingSystem,
        gradingSystem: useGradingSystem ? gradingSystem : [],
        totalMeetings: Number(form.totalMeetings),
        studentMeetings: Number(form.studentMeetings),
        attendancePercentage: Number(form.attendancePercentage),
      });
      setReportData(res.data);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Backend server is not reachable. Please try again later.');
      } else {
        setError(err.response?.data?.message || err.message || 'Unable to create marksheet.');
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Marksheet</h1>
        <Link to="/" className="text-sm font-semibold text-slate-700 underline">
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        {/* ── School Selector ─────────────────────────────────────────── */}
        <div>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Select School *</span>
            {loadingSchools ? (
              <p className="text-sm text-slate-500">Loading schools...</p>
            ) : (
              <select
                value={selectedSchool?._id || ''}
                onChange={handleSchoolChange}
                className="w-full rounded border border-slate-300 px-3 py-2"
                required
              >
                <option value="">-- Select a School --</option>
                {schools.map((school) => (
                  <option key={school._id} value={school._id}>
                    {school.schoolName} &mdash; {school.session}
                  </option>
                ))}
              </select>
            )}
          </label>

          {schools.length === 0 && !loadingSchools && (
            <p className="mt-2 text-sm text-amber-600">
              No schools found.{' '}
              <Link to="/schools/create" className="font-semibold underline">
                Create a school first.
              </Link>
            </p>
          )}

          {/* Auto-filled school details */}
          {selectedSchool && (
            <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <p className="font-bold text-slate-800">{selectedSchool.name || selectedSchool.schoolName}</p>
              <p className="text-slate-600">{selectedSchool.address || selectedSchool.schoolAddress}</p>
              <div className="mt-1 flex flex-wrap gap-4 text-slate-600">
                <span>DISE: {selectedSchool.diseCode || selectedSchool.schoolDISECode}</span>
                <span>PSP: {selectedSchool.pspCode}</span>
                <span>School Code: {selectedSchool.schoolCode}</span>
                <span>Session: {selectedSchool.session}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Student Information ───────────────────────────────────────── */}
        <div>
          <h2 className="mb-3 text-lg font-bold">Student Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ['studentName', 'Student Name', 'text'],
              ['scholarNumber', 'Scholar Number', 'text'],
              ['fatherName', "Father's Name", 'text'],
              ['motherName', "Mother's Name", 'text'],
              ['classSection', 'Class & Section', 'text'],
              ['dateOfBirth', 'Date of Birth', 'date'],
              ['rollNumber', 'Roll Number', 'text'],
            ].map(([name, label, type]) => (
              <label key={name} className="block">
                <span className="mb-1 block text-sm font-semibold">{label}</span>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleBasicChange}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  required
                />
              </label>
            ))}
          </div>
        </div>

        {/* ── Subject Marks ─────────────────────────────────────────────── */}
        {selectedSchool && (
          <div className="overflow-x-auto">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Subject Marks</h2>
              <button
                type="button"
                onClick={() =>
                  setSubjects((prev) => [
                    ...prev,
                    {
                      name: '',
                      marks: (selectedSchool?.examStructure || []).map((e) => ({
                        examName: e.examName,
                        maxMarks: e.maxMarks,
                        obtained: 0,
                      })),
                    },
                  ])
                }
                className="rounded border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                + Add Subject
              </button>
            </div>
            <p className="mb-2 text-xs text-slate-500">
              Har exam cell me pehli value obtained marks aur doosri value max marks hai.
            </p>

            <table className="w-full border-collapse border border-slate-400 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 px-2 py-2 text-left">Subject</th>
                  {selectedSchool.examStructure.map((e) => (
                    <th key={e.examName} className="border border-slate-400 px-2 py-2 text-center">
                      {e.examName}
                      <br />
                      <span className="font-normal text-slate-500 text-xs">max {e.maxMarks}</span>
                    </th>
                  ))}
                  <th className="border border-slate-400 px-2 py-2 text-center">Total</th>
                  <th className="border border-slate-400 px-2 py-2 text-center">Max</th>
                  {useGradingSystem && (
                    <th className="border border-slate-400 px-2 py-2 text-center">Grade</th>
                  )}
                  <th className="border border-slate-400 px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub, si) => {
                  const computed = computedSubjects[si];
                  return (
                    <tr key={si}>
                      <td className="border border-slate-400 px-2 py-1">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleSubjectNameChange(si, e.target.value)}
                          className="w-full rounded border border-slate-300 px-2 py-1"
                          required
                        />
                      </td>
                      {sub.marks.map((mark, mi) => (
                        <td key={mi} className="border border-slate-400 px-2 py-1">
                          <div className="flex flex-col gap-1">
                            <input
                              type="number"
                              min="0"
                              max={mark.maxMarks}
                              value={mark.obtained}
                              onChange={(e) => handleMarkFieldChange(si, mi, 'obtained', e.target.value)}
                              className="w-20 rounded border border-slate-300 px-1 py-1 text-center"
                              title="Obtained Marks"
                            />
                            <input
                              type="number"
                              min="0"
                              value={mark.maxMarks}
                              onChange={(e) => handleMarkFieldChange(si, mi, 'maxMarks', e.target.value)}
                              className="w-20 rounded border border-slate-300 px-1 py-1 text-center text-slate-700"
                              title="Max Marks"
                            />
                          </div>
                        </td>
                      ))}
                      <td className="border border-slate-400 px-2 py-1 text-center font-semibold text-slate-800">
                        {computed?.total ?? 0}
                      </td>
                      <td className="border border-slate-400 px-2 py-1 text-center text-slate-500">
                        {computed?.maxTotal ?? 0}
                      </td>
                      {useGradingSystem && (
                        <td className="border border-slate-400 px-2 py-1 text-center font-semibold text-indigo-700">
                          {computed?.grade || '-'}
                        </td>
                      )}
                      <td className="border border-slate-400 px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setSubjects((prev) => prev.filter((_, i) => i !== si))
                          }
                          className="text-xs font-semibold text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-semibold">
                  <td
                    className="border border-slate-400 px-2 py-1.5"
                    colSpan={selectedSchool.examStructure.length + 1}
                  >
                    Grand Total
                  </td>
                  <td className="border border-slate-400 px-2 py-1.5 text-center text-slate-900">
                    {overallResult.totalObtainedMarks}
                  </td>
                  <td className="border border-slate-400 px-2 py-1.5 text-center text-slate-500">
                    {overallResult.totalMaxMarks}
                  </td>
                  {useGradingSystem && <td className="border border-slate-400 px-2 py-1" />}
                  <td className="border border-slate-400 px-2 py-1" />
                </tr>
                <tr className="bg-slate-50">
                  <td
                    className="border border-slate-400 px-2 py-1.5 font-semibold"
                    colSpan={selectedSchool.examStructure.length + 1}
                  >
                    Percentage
                  </td>
                  <td
                    className="border border-slate-400 px-2 py-1.5 text-center font-bold text-green-700"
                    colSpan={useGradingSystem ? 4 : 3}
                  >
                    {overallResult.percentage}%
                    {useGradingSystem ? ` — Grade ${overallResult.overallGrade || '-'}` : ''} (
                    {overallResult.overallDivision}) &mdash;{' '}
                    <span className={overallResult.result === 'Pass' ? 'text-green-700' : 'text-red-600'}>
                      {overallResult.result}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* ── Extra Subjects ────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Extra Subjects</h2>
            <button
              type="button"
              onClick={() =>
                setExtraSubjects((prev) => [
                  ...prev,
                  { name: '', obtainedMarks: 0, grade: 'A' },
                ])
              }
              className="rounded border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              + Add Extra Subject
            </button>
          </div>
          <table className="w-full border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 px-2 py-2 text-left">Subject</th>
                <th className="border border-slate-400 px-2 py-2">Obtained Marks</th>
                <th className="border border-slate-400 px-2 py-2">Grade</th>
                <th className="border border-slate-400 px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {extraSubjects.map((item, index) => (
                <tr key={index}>
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
                      className="w-full rounded border border-slate-300 px-2 py-1 text-center"
                    />
                  </td>
                  <td className="border border-slate-400 px-2 py-1">
                    <select
                      value={item.grade}
                      onChange={(e) => handleExtraChange(index, 'grade', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1"
                    >
                      {['A', 'B', 'C', 'D'].map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-400 px-2 py-1 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        setExtraSubjects((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="text-xs font-semibold text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Grading System (Optional) ─────────────────────────────────── */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Grading System</h2>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={useGradingSystem}
                onChange={(e) => setUseGradingSystem(e.target.checked)}
                className="h-4 w-4"
              />
              Enable Grade Calculation
            </label>
          </div>

          {useGradingSystem ? (
            <div className="overflow-x-auto">
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setGradingSystem((prev) => [...prev, { grade: '', range: '', description: '' }])
                  }
                  className="rounded border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  + Add Grade Range
                </button>
              </div>
              <table className="w-full border-collapse border border-slate-400 text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-400 px-2 py-2">Grade</th>
                    <th className="border border-slate-400 px-2 py-2">Range (e.g. 86-100)</th>
                    <th className="border border-slate-400 px-2 py-2">Description</th>
                    <th className="border border-slate-400 px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {gradingSystem.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-slate-400 px-2 py-1">
                        <input
                          type="text"
                          value={item.grade}
                          onChange={(e) =>
                            setGradingSystem((prev) =>
                              prev.map((row, i) =>
                                i === index ? { ...row, grade: e.target.value.toUpperCase() } : row
                              )
                            )
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                          placeholder="A+"
                        />
                      </td>
                      <td className="border border-slate-400 px-2 py-1">
                        <input
                          type="text"
                          value={item.range}
                          onChange={(e) =>
                            setGradingSystem((prev) =>
                              prev.map((row, i) =>
                                i === index ? { ...row, range: e.target.value } : row
                              )
                            )
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                          placeholder="86-100"
                        />
                      </td>
                      <td className="border border-slate-400 px-2 py-1">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            setGradingSystem((prev) =>
                              prev.map((row, i) =>
                                i === index ? { ...row, description: e.target.value } : row
                              )
                            )
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                          placeholder="Excellent"
                        />
                      </td>
                      <td className="border border-slate-400 px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setGradingSystem((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="text-xs font-semibold text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-slate-500">
                Invalid range rows are ignored automatically during grade calculation.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Grade system disabled. Subject aur overall result me sirf marks/percentage show hoga.
            </p>
          )}
        </div>

        {/* ── Attendance & Misc ─────────────────────────────────────────── */}
        <div>
          <h2 className="mb-3 text-lg font-bold">Attendance &amp; Remarks</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ['totalMeetings', 'Total Meetings', 'number'],
              ['studentMeetings', 'Student Meetings', 'number'],
              ['attendancePercentage', 'Attendance Percentage', 'number'],
              ['positionInClass', 'Position in Class', 'text'],
              ['resultDate', 'Result Date', 'date'],
            ].map(([name, label, type]) => (
              <label key={name} className="block">
                <span className="mb-1 block text-sm font-semibold">{label}</span>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleBasicChange}
                  className="w-full rounded border border-slate-300 px-3 py-2"
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
              />
            </label>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={saving || !selectedSchool}
          className="w-max rounded bg-slate-900 px-6 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Generate Report Card'}
        </button>
      </form>
    </section>
  );
}

export default CreateMarksheet;
