import { useMemo, useState } from 'react';

function useBackendBaseUrl() {
  const [value, setValue] = useState('http://localhost:4000');
  const normalized = useMemo(() => value.replace(/\/+$/, ''), [value]);
  return [normalized, value, setValue];
}

export default function App() {
  const [backendBaseUrl, backendInput, setBackendInput] = useBackendBaseUrl();

  const [catalogForm, setCatalogForm] = useState({
    productId: '',
    name: '',
    description: '',
    materials: '',
    price: '',
    currency: 'INR',
  });
  const [catalogOutput, setCatalogOutput] = useState(null);
  const [catalogLoading, setCatalogLoading] = useState(false);

  const [proposalForm, setProposalForm] = useState({
    clientName: '',
    industry: '',
    useCase: '',
    priorities: '',
    locations: '',
    headcount: '',
    budgetLimit: '',
    currency: 'INR',
    constraints: '',
  });
  const [proposalOutput, setProposalOutput] = useState(null);
  const [proposalLoading, setProposalLoading] = useState(false);

  function onCatalogChange(field, value) {
    setCatalogForm((prev) => ({ ...prev, [field]: value }));
  }

  function onProposalChange(field, value) {
    setProposalForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCatalogSubmit(e) {
    e.preventDefault();
    setCatalogLoading(true);
    setCatalogOutput(null);
    try {
      const payload = {
        productId: catalogForm.productId || undefined,
        name: catalogForm.name,
        description: catalogForm.description,
        materials: catalogForm.materials
          ? catalogForm.materials
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        price: catalogForm.price ? Number(catalogForm.price) : undefined,
        currency: catalogForm.currency || 'INR',
      };

      const res = await fetch(`${backendBaseUrl}/api/catalog/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }
      setCatalogOutput({ ok: true, data });
    } catch (err) {
      setCatalogOutput({
        ok: false,
        error: err.message || 'Unexpected error',
      });
    } finally {
      setCatalogLoading(false);
    }
  }

  async function handleProposalSubmit(e) {
    e.preventDefault();
    setProposalLoading(true);
    setProposalOutput(null);
    try {
      const payload = {
        clientName: proposalForm.clientName || undefined,
        industry: proposalForm.industry || undefined,
        useCase: proposalForm.useCase || undefined,
        priorities: proposalForm.priorities
          ? proposalForm.priorities
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        locations: proposalForm.locations
          ? proposalForm.locations
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        headcount: proposalForm.headcount
          ? Number(proposalForm.headcount)
          : undefined,
        budgetLimit: proposalForm.budgetLimit
          ? Number(proposalForm.budgetLimit)
          : undefined,
        currency: proposalForm.currency || 'INR',
        constraints: proposalForm.constraints
          ? proposalForm.constraints
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      const res = await fetch(`${backendBaseUrl}/api/proposals/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }
      setProposalOutput({ ok: true, data });
    } catch (err) {
      setProposalOutput({
        ok: false,
        error: err.message || 'Unexpected error',
      });
    } finally {
      setProposalLoading(false);
    }
  }

  const catalogData = catalogOutput?.ok ? catalogOutput.data : null;
  const proposalData = proposalOutput?.ok ? proposalOutput.data : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/70 px-6 py-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">IFA-EMS AI Console</h1>
          <p className="text-xs text-slate-300">
            Auto-category &amp; tagging for catalog + B2B proposal generation.
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 md:px-8 grid gap-6 lg:grid-cols-2">
        {/* Module 1 */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-lg font-semibold">
            Module 1 · Auto-Category &amp; Tag Generator
          </h2>
          <p className="text-xs text-slate-400">
            Calls <code className="text-[11px]">POST /api/catalog/classify</code> on your backend.
          </p>

          <form className="flex flex-col gap-3" onSubmit={handleCatalogSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Product ID (optional)</label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="text"
                value={catalogForm.productId}
                onChange={(e) => onCatalogChange('productId', e.target.value)}
                placeholder="SKU-1234"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Product Name <span className="text-rose-400">*</span>
              </label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="text"
                value={catalogForm.name}
                onChange={(e) => onCatalogChange('name', e.target.value)}
                placeholder="Compostable coffee cup"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                rows={4}
                value={catalogForm.description}
                onChange={(e) =>
                  onCatalogChange('description', e.target.value)
                }
                placeholder="Include materials, usage, sustainability claims..."
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Materials (comma separated)</label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="text"
                value={catalogForm.materials}
                onChange={(e) => onCatalogChange('materials', e.target.value)}
                placeholder="bamboo, recycled paper"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Price (optional)</label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="number"
                min={0}
                step={0.01}
                value={catalogForm.price}
                onChange={(e) => onCatalogChange('price', e.target.value)}
                placeholder="50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Currency</label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="text"
                value={catalogForm.currency}
                onChange={(e) => onCatalogChange('currency', e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={catalogLoading}
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-600 disabled:opacity-60"
            >
              {catalogLoading ? 'Running classification…' : 'Run Auto-Category & Tagging'}
            </button>
          </form>

          <div className="mt-3 space-y-2">
            {catalogOutput && !catalogOutput.ok && (
              <div className="rounded-lg border border-rose-500/60 bg-rose-950/60 px-3 py-2 text-xs text-rose-100">
                Error: {catalogOutput.error}
              </div>
            )}

            {catalogData && (
              <div className="space-y-2 text-xs">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">
                    Category:{' '}
                    <span className="font-semibold text-emerald-300">
                      {catalogData.primaryCategory}
                    </span>
                  </span>
                  {catalogData.subCategory && (
                    <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">
                      Sub:{' '}
                      <span className="font-semibold text-emerald-200">
                        {catalogData.subCategory}
                      </span>
                    </span>
                  )}
                </div>

                {catalogData.seoTags?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-200 mb-1">
                      SEO Tags
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {catalogData.seoTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-sky-500/10 text-[11px] text-sky-100 border border-sky-500/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {catalogData.sustainabilityFilters?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-200 mb-1">
                      Sustainability Filters
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {catalogData.sustainabilityFilters.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[11px] text-emerald-100 border border-emerald-500/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Module 2 */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-lg font-semibold">
            Module 2 · B2B Proposal Generator
          </h2>
          <p className="text-xs text-slate-400">
            Calls <code className="text-[11px]">POST /api/proposals/generate</code> on your backend.
          </p>

          <form className="flex flex-col gap-3" onSubmit={handleProposalSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Client Name</label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="text"
                value={proposalForm.clientName}
                onChange={(e) =>
                  onProposalChange('clientName', e.target.value)
                }
                placeholder="Acme Corp"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Industry</label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="text"
                value={proposalForm.industry}
                onChange={(e) => onProposalChange('industry', e.target.value)}
                placeholder="FMCG, IT services, hospitality..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Primary Use-Case</label>
              <textarea
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                rows={3}
                value={proposalForm.useCase}
                onChange={(e) => onProposalChange('useCase', e.target.value)}
                placeholder="Employee gifting, event giveaways, office supplies..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Priorities (comma separated)
              </label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="text"
                value={proposalForm.priorities}
                onChange={(e) => onProposalChange('priorities', e.target.value)}
                placeholder="plastic-free, premium feel, local sourcing"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Locations (comma separated)
              </label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="text"
                value={proposalForm.locations}
                onChange={(e) => onProposalChange('locations', e.target.value)}
                placeholder="Mumbai, Delhi, Bengaluru"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Headcount (approx.)</label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="number"
                min={1}
                value={proposalForm.headcount}
                onChange={(e) => onProposalChange('headcount', e.target.value)}
                placeholder="500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Budget Limit <span className="text-rose-400">*</span>
              </label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="number"
                min={1}
                step={1}
                value={proposalForm.budgetLimit}
                onChange={(e) =>
                  onProposalChange('budgetLimit', e.target.value)
                }
                placeholder="100000"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Currency</label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="text"
                value={proposalForm.currency}
                onChange={(e) => onProposalChange('currency', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Constraints (comma separated)
              </label>
              <input
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
                type="text"
                value={proposalForm.constraints}
                onChange={(e) =>
                  onProposalChange('constraints', e.target.value)
                }
                placeholder="no plastic, India-only sourcing"
              />
            </div>

            <button
              type="submit"
              disabled={proposalLoading}
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-600 disabled:opacity-60"
            >
              {proposalLoading ? 'Generating proposal…' : 'Generate B2B Proposal'}
            </button>
          </form>

          <div className="mt-3 space-y-2 text-xs">
            {proposalOutput && !proposalOutput.ok && (
              <div className="rounded-lg border border-rose-500/60 bg-rose-950/60 px-3 py-2 text-xs text-rose-100">
                Error: {proposalOutput.error}
              </div>
            )}

            {proposalData && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">
                    Engine: <span>{proposalData.engine}</span>
                  </span>
                  {proposalData.estimatedCostBreakdown && (
                    <>
                      <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">
                        Total:{' '}
                        <span className="font-semibold text-emerald-300">
                          {proposalData.estimatedCostBreakdown.total}{' '}
                          {proposalData.estimatedCostBreakdown.currency}
                        </span>
                      </span>
                      <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">
                        Per person:{' '}
                        <span className="font-semibold text-emerald-200">
                          {proposalData.estimatedCostBreakdown.perPerson}{' '}
                          {proposalData.estimatedCostBreakdown.currency}
                        </span>
                      </span>
                    </>
                  )}
                </div>

                {proposalData.suggestedMix?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-200">
                      Suggested Sustainable Product Mix
                    </p>
                    <div className="max-h-40 overflow-auto rounded-lg border border-slate-800">
                      <table className="min-w-full text-[11px]">
                        <thead className="bg-slate-900/80 text-slate-300">
                          <tr>
                            <th className="px-2 py-1 text-left font-medium">
                              Product
                            </th>
                            <th className="px-2 py-1 text-left font-medium">
                              Qty
                            </th>
                            <th className="px-2 py-1 text-left font-medium">
                              Unit
                            </th>
                            <th className="px-2 py-1 text-left font-medium">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {proposalData.suggestedMix.map((item, idx) => (
                            <tr
                              key={`${item.productName}-${idx}`}
                              className="odd:bg-slate-900/40 even:bg-slate-950/40"
                            >
                              <td className="px-2 py-1 align-top">
                                <div className="font-medium text-slate-100">
                                  {item.productName}
                                </div>
                                {item.sustainabilityNotes && (
                                  <div className="text-[10px] text-emerald-200">
                                    {item.sustainabilityNotes}
                                  </div>
                                )}
                              </td>
                              <td className="px-2 py-1 align-top">
                                {item.quantity}
                              </td>
                              <td className="px-2 py-1 align-top">
                                {item.unitPrice}
                              </td>
                              <td className="px-2 py-1 align-top">
                                {item.totalPrice}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {proposalData.budgetAllocation?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-200 mb-1">
                      Budget Allocation
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {proposalData.budgetAllocation.map((b) => (
                        <span
                          key={b.bucket}
                          className="px-2 py-0.5 rounded-full bg-sky-500/10 text-[11px] text-sky-100 border border-sky-500/40"
                        >
                          {b.bucket}: {b.amount} ({b.percentage}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {proposalData.impactSummary && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-200 mb-1">
                      Impact Positioning Summary
                    </p>
                    <p className="text-[11px] text-slate-200 leading-relaxed">
                      {proposalData.impactSummary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/80 px-4 py-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
        <span>Backend base URL:</span>
        <input
          className="rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-100"
          value={backendInput}
          onChange={(e) => setBackendInput(e.target.value)}
        />
        <span className="text-[11px] text-slate-400">
          Current: <code>{backendBaseUrl}</code>
        </span>
      </footer>
    </div>
  );
}