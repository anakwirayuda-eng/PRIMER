const fs = require('fs');
const f = 'src/components/emr/sidebar/MAIAValidationOverlay.jsx';
let c = fs.readFileSync(f, 'utf8');

const marker = '                    </div>\r\n\r\n                    <button';

const suggestionBlock = `                    </div>

                    {/* MAIA Exam/Lab Suggestions */}
                    {(maiaFeedback?.examLabSuggestions?.examSuggestions?.length > 0 || maiaFeedback?.examLabSuggestions?.labSuggestions?.length > 0) && (
                        <div className={\`rounded-xl p-3 space-y-2 border \${isDark ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}\`}>
                            <div className="flex items-center gap-1.5">
                                <Stethoscope size={12} className="text-cyan-500" />
                                <span className={\`text-[9px] font-black uppercase tracking-widest \${isDark ? 'text-cyan-400' : 'text-cyan-700'}\`}>Saran MAIA</span>
                            </div>
                            {maiaFeedback.examLabSuggestions.examSuggestions.length > 0 && (
                                <div className="space-y-0.5">
                                    <span className={\`text-[9px] font-bold \${isDark ? 'text-slate-500' : 'text-slate-400'}\`}>Pemeriksaan Fisik:</span>
                                    {maiaFeedback.examLabSuggestions.examSuggestions.map(s => (
                                        <p key={s.id} className={\`text-[10px] flex items-start gap-1 \${isDark ? 'text-cyan-300' : 'text-cyan-700'}\`}>
                                            <span className="flex-shrink-0">{'\u2192'}</span>
                                            <span>{s.label}</span>
                                        </p>
                                    ))}
                                </div>
                            )}
                            {maiaFeedback.examLabSuggestions.labSuggestions.length > 0 && (
                                <div className="space-y-0.5">
                                    <span className={\`text-[9px] font-bold \${isDark ? 'text-slate-500' : 'text-slate-400'}\`}>Laboratorium:</span>
                                    {maiaFeedback.examLabSuggestions.labSuggestions.map(s => (
                                        <p key={s.id} className={\`text-[10px] flex items-start gap-1 \${isDark ? 'text-cyan-300' : 'text-cyan-700'}\`}>
                                            <span className="flex-shrink-0">{'\u2192'}</span>
                                            <span>{s.label}</span>
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button`;

if (c.includes(marker)) {
    c = c.replace(marker, suggestionBlock);
    fs.writeFileSync(f, c);
    console.log('OK: inserted exam/lab suggestions into MAIAValidationOverlay.jsx');
} else {
    console.log('FAIL: marker not found');
}
