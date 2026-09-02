import api from './index.js'

export const healthcheckApi = {
  chat(messages) {
    return api.post('/api/recommend/healthcheck/chat', { messages })
  },
  summarize(messages) {
    return api.post('/api/recommend/healthcheck/summarize', { messages })
  }
}
