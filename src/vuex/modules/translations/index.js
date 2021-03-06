import axios from 'axios'
import { languages } from 'countries-list'

// This module handles the global store and requests for the Translations endpoint + some frontend bits
const translations = {
  state: {
    baseLanguage: null,
    selectedLanguage: {
      label: '',
      value: {
        code: ''
      }
    },
    languages: null,
    filter: {
      all: true,
      needsTranslation: false,
      needsRevision: false
    },
    documentToEdit: null
  },
  mutations: {
    SET_BASE_LANGUAGE: (state, baseLanguage) => {
      state.baseLanguage = {
        label: `${languages[baseLanguage.code].name} (${baseLanguage.code})`,
        value: baseLanguage
      }
    },
    SET_LANGUAGES: (state, languageList) => {
      state.languages = []

      languageList.forEach((lang) => {
        if (lang.code !== state.baseLanguage.value.code) {
          state.languages.push({
            label: `${languages[lang.code].name} (${lang.code})`,
            value: lang
          })
        }
      })
    },
    SET_SELECTED_LANGUAGE: (state, selectedLanguage) => {
      state.selectedLanguage = selectedLanguage
    },
    SET_TRANSLATION_FILTER: (state, filter) => {
      state.filter.all = filter.all
      state.filter.needsTranslation = filter.needsTranslation
      state.filter.needsRevision = filter.needsRevision
    },
    SET_DOCUMENT_EDIT: (state, doc) => {
      state.documentToEdit = doc
    },
    SET_FILTER: (state, filter) => {
      state.filter = filter
    }
  },
  actions: {
    CHANGE_BASE_LANGUAGE: ({ commit }, baseLanguage) => {
      commit('SET_BASE_LANGUAGE', baseLanguage)
    },
    CHANGE_AVAILABLE_LANGUAGES: ({commit, state}, languages) => {
      commit('SET_LANGUAGES', languages)
    },
    CHANGE_SELECTED_LANGUAGE: ({ commit }, selectedLanguage) => {
      commit('SET_SELECTED_LANGUAGE', selectedLanguage)
    },
    CHANGE_TRANSLATION_FILTER: ({ commit }, filter) => {
      commit('SET_TRANSLATION_FILTER', filter)
    },
    CHANGE_EDIT_DOCUMENT: ({ commit }, doc) => {
      commit('SET_DOCUMENT_EDIT', doc)
    },
    UPDATE_DIRECTORY_TITLE: ({ dispatch, commit }, options) => {
      let data = {
        title: options.title
      }

      if (options.newRevision !== undefined) {
        data['newRevision'] = options.newRevision
      }

      if (options.revision !== undefined) {
        data['revision'] = options.revision
      }
      // /api/directories/:id/translations/:lang
      return axios.put('directories/' + options.directoryId + '/translations/' + options.lang, data)
      .then(() => {
        // Re create the structure
        commit('SET_DIRECTORY_TITLE', {directoryId: options.directoryId, title: options.title, language: options.lang})
        dispatch('SET_STRUCTURE_FROM_FLAT')
      })
      .catch(err => {
        commit('SET_MESSAGE', { message: err })
        throw err
      })
    },
    UPDATE_TRANSLATION_FILTER: ({ commit }, filter) => {
      commit('SET_FILTER', filter)
    }
  }
}

export default translations
