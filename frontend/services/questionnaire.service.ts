export const questionnaireService = {
  getQuestionnaire: async () => {
    const response = await fetch('/api/questionnaire');
    return response.json();
  },

  submitQuestionnaire: async (answers: { [key: string]: string }) => {
    const response = await fetch('/api/questionnaire/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    });
    return response.json();
  },

  getStatus: async () => {
    const response = await fetch('/api/questionnaire/status');
    return response.json();
  }
}; 