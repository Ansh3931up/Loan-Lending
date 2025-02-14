interface QuestionnaireService {
  getQuestionnaire: () => Promise<any>;
  submitQuestionnaire: (answers: { [key: string]: string }) => Promise<any>;
  getStatus: () => Promise<any>;
}
