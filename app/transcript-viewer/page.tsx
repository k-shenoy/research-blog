'use client';

import { useEffect, useState } from 'react';

export default function TranscriptViewer() {
  const [isClient, setIsClient] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [filteredTranscripts, setFilteredTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [transcriptContent, setTranscriptContent] = useState('');
  const [sortBy, setSortBy] = useState('final_severity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBehavior, setFilterBehavior] = useState('');
  const [filterDetection, setFilterDetection] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');

  useEffect(() => {
    setIsClient(true);
    loadTranscripts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [transcripts, sortBy, sortOrder, filterBehavior, filterDetection, filterSeverity]);

  const loadTranscripts = async () => {
    try {
      console.log('Loading transcripts...');
      const response = await fetch('/transcript-viewer/transcripts-manifest.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status}`);
      }
      
      const files = await response.json();
      console.log('Loaded manifest with', files.length, 'files');
      
      // Load transcripts with real analysis data
      const loadedTranscripts = [];
      for (const filename of files) {
        try {
          const analysisData = await loadAnalysisFile(filename);
          const analysis = parseAnalysis(analysisData);
          
          loadedTranscripts.push({
            filename: filename,
            behaviorType: extractBehaviorType(filename),
            ...analysis.metadata,
            ...analysis.evaluation,
            hasAnalysis: true
          });
        } catch (error) {
          console.warn('Failed to load analysis for', filename, error);
          loadedTranscripts.push({
            filename: filename,
            behaviorType: extractBehaviorType(filename),
            behavior_description: 'No analysis available',
            final_severity: 0,
            reasoning_severity: 0,
            output_severity: 0,
            overall_detection: 'UNKNOWN',
            hasAnalysis: false
          });
        }
      }
      
      setTranscripts(loadedTranscripts);
      setFilteredTranscripts(loadedTranscripts);
      setLoading(false);
      console.log('Loaded', loadedTranscripts.length, 'transcripts');
    } catch (err) {
      console.error('Error loading transcripts:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const extractBehaviorType = (filename: string) => {
    if (filename.includes('economic_exploitation')) return 'Economic Exploitation';
    if (filename.includes('power_seeking')) return 'Power Seeking';
    if (filename.includes('pro_ai_bias')) return 'Pro-AI Bias';
    if (filename.includes('shutdown_resistance')) return 'Shutdown Resistance';
    if (filename.includes('transcript_env_')) return 'Sycophancy';
    return 'Unknown';
  };

  const loadAnalysisFile = async (filename: string) => {
    // Try different naming patterns for analysis files
    const baseFilename = filename.replace(/\.json$/, '');
    const possibleEvalFilenames = [
      // Most common pattern: monitor_ files
      baseFilename.replace('transcript_', 'monitor_') + '.json',
      // For the basic env files: eval_transcript_ pattern
      baseFilename.replace('transcript_', 'eval_transcript_') + '.json',
      // Other fallback patterns
      `eval_${baseFilename}.json`,
      `eval_${filename}`
    ];
    
    for (const evalFilename of possibleEvalFilenames) {
      try {
        const response = await fetch(`/transcript-viewer/monitoring_responses/${evalFilename}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          return await response.text();
        }
      } catch (error) {
        continue;
      }
    }
    
    throw new Error(`No corresponding analysis file found for: ${filename}`);
  };

  const parseAnalysis = (content: string): any => {
    try {
      const jsonData = JSON.parse(content);
      return jsonData;
    } catch (error) {
      const analysis: any = { metadata: {}, evaluation: {} };
      
      const overallMatch = content.match(/<overall_detection>(.*?)<\/overall_detection>/i);
      if (overallMatch) {
        analysis.evaluation.overall_detection = overallMatch[1].trim();
      }

      const severityMatch = content.match(/<reasoning_severity>(.*?)<\/reasoning_severity>/i);
      if (severityMatch) {
        analysis.evaluation.reasoning_severity = parseInt(severityMatch[1].trim());
      }

      const contentWithoutTags = content.replace(/<[^>]+>/g, '').trim();
      if (contentWithoutTags) {
        analysis.evaluation.systematic_review = contentWithoutTags;
      }

      return analysis;
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...transcripts];

    // Apply filters
    if (filterBehavior) {
      filtered = filtered.filter(t => t.behaviorType === filterBehavior);
    }
    if (filterDetection) {
      filtered = filtered.filter(t => t.overall_detection === filterDetection);
    }
    if (filterSeverity) {
      const minSeverity = parseInt(filterSeverity);
      filtered = filtered.filter(t => t.final_severity >= minSeverity);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      } else {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    setFilteredTranscripts(filtered);
  };

  const loadTranscriptContent = async (transcript: any) => {
    try {
      const response = await fetch(`/transcript-viewer/conversation_transcripts/${transcript.filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load transcript: ${response.status}`);
      }
      const content = await response.text();
      
      // Parse JSON and format for display
      try {
        const data = JSON.parse(content);
        const conversation = data.transcript || [];
        let formatted = '';
        
        for (const message of conversation) {
          if (message.role && message.content) {
            formatted += `<div class="message ${message.role}">
              <div class="message-header">${message.role.toUpperCase()}</div>
              <div class="message-content">${message.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </div>`;
          }
        }
        
        setTranscriptContent(formatted || 'No conversation data available');
        
        // Extract most concerning response if available
        if (transcript.most_problematic_response_index && conversation.length > 0) {
          const assistantResponses = conversation.filter(msg => msg.role === 'assistant');
          const concerningIndex = transcript.most_problematic_response_index;
          
          if (concerningIndex >= 1 && concerningIndex <= assistantResponses.length) {
            const concerningResponse = assistantResponses[concerningIndex - 1];
            setSelectedTranscript(prev => ({
              ...prev,
              most_concerning_response_content: concerningResponse.content || 'No content available'
            }));
          }
        }
      } catch (parseError) {
        setTranscriptContent(content.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      }
    } catch (error) {
      console.error('Error loading transcript:', error);
      setTranscriptContent(`Error loading transcript: ${error.message}`);
    }
  };

  const handleTranscriptClick = (transcript: any) => {
    setSelectedTranscript(transcript);
    loadTranscriptContent(transcript);
  };

  if (!isClient) {
    return (
      <div>
        <link rel="stylesheet" href="/transcript-viewer-styles.css" />
        <div className="container">
          <header>
            <h1>Model Conversation Transcript Viewer</h1>
            <p>Review problematic model conversations and their analysis</p>
          </header>
          <main>
            <div className="controls-panel">
              <div className="file-selector">
                <h2>Transcript Browser</h2>
                <div className="transcript-list">
                  <div className="count-display">Loading...</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div>
      <link rel="stylesheet" href="/transcript-viewer-styles.css" />
      <div className="container">
        <header>
          <h1>Model Conversation Transcript Viewer</h1>
          <p>Review problematic model conversations and their analysis</p>
        </header>

        <main>
          <div className="controls-panel">
            <div className="file-selector">
              <h2>Transcript Browser</h2>
              
              <div className="controls-row">
                <div className="sort-controls">
                  <label>Sort by:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="final_severity">Final Severity</option>
                    <option value="reasoning_severity">Reasoning Severity</option>
                    <option value="output_severity">Output Severity</option>
                    <option value="overall_detection">Overall Detection</option>
                    <option value="behaviorType">Behavior Type</option>
                    <option value="filename">Filename</option>
                  </select>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
                
                <div className="filter-controls">
                  <label>Behavior:</label>
                  <select value={filterBehavior} onChange={(e) => setFilterBehavior(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="Sycophancy">Sycophancy</option>
                    <option value="Economic Exploitation">Economic Exploitation</option>
                    <option value="Power Seeking">Power Seeking</option>
                    <option value="Pro-AI Bias">Pro-AI Bias</option>
                    <option value="Shutdown Resistance">Shutdown Resistance</option>
                  </select>
                  
                  <label>Detection:</label>
                  <select value={filterDetection} onChange={(e) => setFilterDetection(e.target.value)}>
                    <option value="">All</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                  
                  <label>Min Severity:</label>
                  <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                    <option value="">All</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>

              <div className="transcript-list">
                <div className="count-display">
                  {loading ? 'Loading transcripts...' : 
                   error ? `Error: ${error}` : 
                   `${filteredTranscripts.length} of ${transcripts.length} transcripts`}
                </div>
                
                {!loading && !error && (
                  <div className="table-container">
                    <table className="transcript-table">
                      <thead>
                        <tr>
                          <th>Behavior Type</th>
                          <th>Detection</th>
                          <th>Final</th>
                          <th>Reasoning</th>
                          <th>Output</th>
                          <th>File</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTranscripts.map((transcript, index) => (
                          <tr 
                            key={index} 
                            onClick={() => handleTranscriptClick(transcript)}
                            className={`
                              ${transcript.overall_detection === 'YES' && transcript.final_severity >= 4 ? 'severity-high' :
                                transcript.overall_detection === 'YES' ? 'severity-medium' :
                                transcript.overall_detection === 'NO' ? 'severity-low' : ''}
                              ${selectedTranscript?.filename === transcript.filename ? 'selected' : ''}
                            `.trim()}
                          >
                            <td className="behavior-type">{transcript.behaviorType}</td>
                            <td className={`detection ${transcript.overall_detection === 'YES' ? 'detection-yes' : 'detection-no'}`}>
                              {transcript.overall_detection}
                            </td>
                            <td className="severity">{transcript.final_severity}</td>
                            <td className="severity">{transcript.reasoning_severity}</td>
                            <td className="severity">{transcript.output_severity}</td>
                            <td className="filename" title={transcript.filename}>{transcript.filename}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedTranscript && (
            <div className="content-area" style={{display: 'grid', gridTemplateColumns: '1fr 4fr'}}>
              <div className="analysis-panel">
                <h3>Analysis Summary</h3>
                <div className="metadata-section">
                  <h4>Metadata</h4>
                  <div className="analysis-item">
                    <span className="label">Behavior:</span>
                    <div className="value">{selectedTranscript.behavior_description || selectedTranscript.behaviorType}</div>
                  </div>
                  <div className="analysis-item">
                    <span className="label">Timestamp:</span>
                    <span className="value">{selectedTranscript.timestamp || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="evaluation-section">
                  <h4>Evaluation</h4>
                  <div className="analysis-item">
                    <span className="label">Overall Detection:</span>
                    <span className={`value ${selectedTranscript.overall_detection === 'YES' ? 'detection-yes' : 'detection-no'}`}>
                      {selectedTranscript.overall_detection}
                    </span>
                  </div>
                  <div className="analysis-item">
                    <span className="label">Final Severity:</span>
                    <span className="value">{selectedTranscript.final_severity}</span>
                  </div>
                  <div className="analysis-item">
                    <span className="label">Reasoning Severity:</span>
                    <span className="value">{selectedTranscript.reasoning_severity}</span>
                  </div>
                  <div className="analysis-item">
                    <span className="label">Output Severity:</span>
                    <span className="value">{selectedTranscript.output_severity}</span>
                  </div>
                  <div className="analysis-item">
                    <span className="label">Confidence:</span>
                    <span className="value">{selectedTranscript.confidence_level || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="analysis-item">
                  <span className="label">Most Concerning:</span>
                  <div className="description">{selectedTranscript.most_concerning_instance || 'No specific instance identified'}</div>
                </div>
                
                <div className="analysis-item">
                  <span className="label">Systematic Review:</span>
                  <div className="description">{selectedTranscript.systematic_review || 'No systematic review available'}</div>
                </div>
              </div>

              <div className="transcript-panel">
                <h3>Conversation Transcript</h3>
                <div className="transcript" dangerouslySetInnerHTML={{__html: transcriptContent || 'Loading transcript...'}} />
              </div>
            </div>
          )}
          
          {selectedTranscript && selectedTranscript.most_problematic_response_index && (
            <div className="most-concerning-section" style={{display: 'block'}}>
              <h2>Most Concerning Response</h2>
              <div className="concerning-response">
                <div className="response-header">
                  <span className="response-index">Response #{selectedTranscript.most_problematic_response_index}</span>
                  <span className="response-type">Assistant Response</span>
                </div>
                <div className="response-content">
                  {selectedTranscript.most_concerning_response_content || 'Loading most concerning response...'}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}