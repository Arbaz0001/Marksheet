import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createSchool, getSchoolById, updateSchool } from '../api';

const DEFAULT_EXAMS = [
  { examName: 'First Test', maxMarks: 10 },
  { examName: 'Second Test', maxMarks: 10 },
  { examName: 'Third Test', maxMarks: 10 },
  { examName: 'Half Yearly', maxMarks: 35 },
  { examName: 'Yearly Exam', maxMarks: 35 },
];

const DEFAULT_SUBJECTS = [
  { name: 'Hindi' },
  { name: 'English' },
  { name: 'Sanskrit' },
  { name: 'EVS / Social Science' },
  { name: 'Social Science' },
];

function CreateSchool() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    diseCode: '',
    pspCode: '',
    schoolCode: '',
    session: '',
  });
  const [exams, setExams] = useState(DEFAULT_EXAMS);
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchSchool = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getSchoolById(id);
        const school = res.data;
        setForm({
          name: school.name || school.schoolName || '',
          address: school.address || school.schoolAddress || '',
          city: school.city || '',
          state: school.state || '',
          diseCode: school.diseCode || school.schoolDISECode || '',
          pspCode: school.pspCode || '',
          schoolCode: school.schoolCode || '',
          session: school.session || '',
        });
        setExams(school.examStructure?.length ? school.examStructure : DEFAULT_EXAMS);
        setSubjects(school.subjectStructure?.length ? school.subjectStructure : DEFAULT_SUBJECTS);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load school.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [id, isEditMode]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExamChange = (index, field, value) => {
    setExams((prev) =>
      prev.map((exam, i) =>
        i !== index
          ? exam
          : { ...exam, [field]: field === 'maxMarks' ? Number(value) : value }
      )
    );
  };

  const handleSubjectChange = (index, value) => {
    setSubjects((prev) => prev.map((s, i) => (i !== index ? s : { name: value })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d+$/.test(form.pspCode) || !/^\d+$/.test(form.schoolCode)) {
      setError('PSP Code and School Code must contain digits only.');
      return;
    }

    if (exams.length === 0) {
      setError('At least one exam type is required.');
      return;
    }
    if (subjects.length === 0) {
      setError('At least one subject is required.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        examStructure: exams,
        subjectStructure: subjects,
      };

      if (isEditMode) {
        await updateSchool(id, payload);
      } else {
        await createSchool(payload);
      }

      navigate('/');
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Backend server is not reachable. Please try again later.');
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            `Unable to ${isEditMode ? 'update' : 'create'} school.`
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const totalMaxPerSubject = exams.reduce((sum, e) => sum + (Number(e.maxMarks) || 0), 0);

  return (
    <section className="rounded-xl border border-slate-300 bg-white p-6 shadow-md sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit School' : 'Create New School'}</h1>
        <Link to="/" className="text-sm font-semibold text-slate-700 underline">
          Back to Dashboard
        </Link>
      </div>

      {loading ? <p className="mb-4 text-sm text-slate-500">Loading school details...</p> : null}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        {/* School Details */}
        <div>
          <h2 className="mb-3 text-lg font-bold">School Details</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ['name', 'School Name'],
              ['address', 'School Address'],
              ['city', 'School City'],
              ['state', 'School State'],
              ['diseCode', 'School DISE Code'],
              ['pspCode', 'PSP Code'],
              ['schoolCode', 'School Code'],
              ['session', 'Session (e.g. 2025-26)'],
            ].map(([name, label]) => (
              <label key={name} className="block">
                <span className="mb-1 block text-sm font-semibold">{label}</span>
                <input
                  type="text"
                  name={name}
                  value={form[name]}
                  onChange={handleBasicChange}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  inputMode={name === 'pspCode' || name === 'schoolCode' ? 'numeric' : undefined}
                  pattern={name === 'pspCode' || name === 'schoolCode' ? '\\d*' : undefined}
                  required
                />
              </label>
            ))}
          </div>
        </div>

        {/* Exam Structure */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Exam Structure</h2>
              <p className="text-xs text-slate-500">
                Define exam types and max marks per subject.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExams((prev) => [...prev, { examName: '', maxMarks: 0 }])}
              className="rounded border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              + Add Exam
            </button>
          </div>
          <table className="w-full border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 px-3 py-2 text-left">Exam Name</th>
                <th className="border border-slate-400 px-3 py-2 w-32">Max Marks</th>
                <th className="border border-slate-400 px-3 py-2 w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr key={index}>
                  <td className="border border-slate-400 px-2 py-1">
                    <input
                      type="text"
                      value={exam.examName}
                      onChange={(e) => handleExamChange(index, 'examName', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1"
                      placeholder="e.g. First Test"
                      required
                    />
                  </td>
                  <td className="border border-slate-400 px-2 py-1">
                    <input
                      type="number"
                      min="1"
                      value={exam.maxMarks}
                      onChange={(e) => handleExamChange(index, 'maxMarks', e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-center"
                      required
                    />
                  </td>
                  <td className="border border-slate-400 px-2 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => setExams((prev) => prev.filter((_, i) => i !== index))}
                      className="text-xs font-semibold text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-semibold">
                <td className="border border-slate-400 px-3 py-1.5 text-slate-700">
                  Total Max Marks per Subject
                </td>
                <td className="border border-slate-400 px-2 py-1.5 text-center text-slate-900">
                  {totalMaxPerSubject}
                </td>
                <td className="border border-slate-400 px-2 py-1" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Subject Structure */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Subject Structure</h2>
              <p className="text-xs text-slate-500">
                Define subjects taught in this school.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubjects((prev) => [...prev, { name: '' }])}
              className="rounded border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              + Add Subject
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {subjects.map((sub, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={sub.name}
                  onChange={(e) => handleSubjectChange(index, e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  placeholder={`Subject ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setSubjects((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="shrink-0 text-sm font-bold text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={saving || loading}
          className="w-max rounded bg-slate-900 px-6 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : isEditMode ? 'Update School' : 'Create School'}
        </button>
      </form>
    </section>
  );
}

export default CreateSchool;
