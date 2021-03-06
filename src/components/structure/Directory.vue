<template>
  <div class="directory">
    <!-- Chevron toggle for expanding sub items (See #collapse-directories for the actual collapsable area) -->
    <chevron-toggle :value="isExpanded" v-on:change="toggleDirectory" v-if="directory.directories.length" class="chevron mt-3"></chevron-toggle>
    <b-card :class="{ noToggle: !directory.directories.length }">

      <!-- Module Header (The bit that's not hidden) -->
      <div class="d-flex align-items-baseline flex-wrap content">

        <h4><span v-if="isModule">{{ $t('projects.modules.module') }}</span> <span v-for="number in directoryNumbers">{{ number + 1}}.</span><span>{{ directory.order + 1}}</span></h4>
        <i v-if="!editTitle" class="ml-2" @click="editTitle = directory.id === null ? false : true">
          <span v-if="title.length > 0">{{ title }}</span>
          <b-badge
            v-b-tooltip.hover.auto
            :title="directory.id === null ? $t('projects.modules.saveStructure') : ''"
            variant="danger"
            v-else>
            {{$t('projects.modules.noTitle')}}
          </b-badge>
        </i>

        <b-row class="title-input ml-2 w-75" align-h="around" align-v="center" v-else>
          <b-col md="12">
            <b-input-group class="w-100">
              <b-form-input v-model="title" class="w-100"
                      type="text"
                      :placeholder="$t('projects.modules.titlePlaceholder')">
              </b-form-input>

              <b-input-group-button slot="right" class="ignore-drag">
                <b-dropdown :text="$t('common.save')" variant="primary" right>
                  <fa-icon slot="text" name="check"></fa-icon>
                  <b-dropdown-item @click="updateText(true)">{{ $t('common.saveWrevision') }}</b-dropdown-item>
                  <b-dropdown-item @click="updateText(false)">{{ $t('common.save') }}</b-dropdown-item>
                </b-dropdown>
              </b-input-group-button>

            </b-input-group>
          </b-col>
        </b-row>

        <!-- Push this stuff right-->
        <div class="ml-auto">
          <b-dropdown right no-flip class="directory-actions ignore-drag btn-less-padding" variant="outline-primary">
            <fa-icon name="cog" slot="text"></fa-icon>

            <b-dropdown-item @click="editTitle = true" class="directory-action" :disabled="directory.id === null">
              <span v-b-tooltip.hover.auto :title="directory.id === null ? $t('projects.modules.saveStructure') : ''">
                <fa-icon name="font"></fa-icon>
                {{ $t('common.rename') }}
              </span>
            </b-dropdown-item>

            <b-dropdown-item v-if="isShown" @click="addDirectory" class="directory-action" :disabled="directory.id === null">
              <span v-b-tooltip.hover.auto :title="directory.id === null ? $t('projects.modules.saveStructure') : ''">
                <fa-icon name="plus-circle"></fa-icon>
                {{ $t('projects.modules.addDirectory') }}
              </span>
            </b-dropdown-item>

            <b-dropdown-item v-else-if="$auth.check(['admin', 'editor'])" @click="addDirectory" class="directory-action" :disabled="directory.id === null">
              <span v-b-tooltip.hover.auto :title="directory.id === null ? $t('projects.modules.saveStructure') : ''">
                <fa-icon name="plus-circle"></fa-icon>
                {{ $t('projects.modules.addSubDirectory') }}
              </span>
            </b-dropdown-item>

            <b-dropdown-divider v-if="$auth.check(['admin'])"></b-dropdown-divider>

            <b-dropdown-item @click="openMetadataModal(directory.id, directory.metadata)" class="directory-action" :disabled="directory.id === null">
              <span v-b-tooltip.hover.auto :title="directory.id === null ? $t('projects.modules.saveStructure') : ''">
                <fa-icon name="pencil"></fa-icon>
                {{ $t('projects.modules.openMetadataModal') }}
              </span>
            </b-dropdown-item>

            <b-dropdown-divider></b-dropdown-divider>

            <b-dropdown-item-btn href="#" class="directory-action" @click="removeDirectory">
              <fa-icon name="trash"></fa-icon>
              {{ $t('common.delete') }}
            </b-dropdown-item-btn>

          </b-dropdown>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <b-button-group class="mt-1">
            <b-button
              variant="primary"
              size="sm"
              @click="isFilesOpen = !isFilesOpen"
              :disabled="directory.files.length === 0">
                <fa-icon name="file-text"></fa-icon> {{ directory.files.length }} {{ $t('projects.files.files') }}
            </b-button>
            <b-button
              variant="success"
              size="sm"
              @click="openFileSelectModal"
              :disabled="directory.id === null">
              <span v-b-tooltip.hover.auto :title="directory.id === null ? $t('projects.modules.saveStructure') : ''">
                <fa-icon name="plus"></fa-icon>
                {{ $t('projects.files.add') }}
              </span>
            </b-button>
          </b-button-group>
          <b-button-group class="mt-1">
            <b-button
              variant="primary"
              size="sm"
              @click="isDocsOpen = !isDocsOpen"
              :disabled="directory.documents.length === 0">
                <fa-icon name="book"></fa-icon> {{ directory.documents.length }} {{ $t('projects.modules.addDocument') }}
            </b-button>
            <b-button
              variant="success"
              size="sm"
              @click="openDocumentModal"
              :disabled="directory.id === null">
              <span v-b-tooltip.hover.auto :title="directory.id === null ? $t('projects.modules.saveStructure') : ''">
                <fa-icon name="plus"></fa-icon>
                {{ $t('projects.files.add') }}
              </span>
            </b-button>
          </b-button-group>
        </div>
      </div>

      <!-- Here's where we want our file area -->
      <b-collapse :visible="isFilesOpen" id="collapse-extra-file-content">
        <p class="mt-1">
          {{ $t('projects.files.files') }}
        </p>
        <Files :files="directory.files" v-on:close="isFilesOpen = false"></Files>
      </b-collapse>

      <b-collapse :visible="isDocsOpen" id="collapse-extra-document-content">
        <p class="mt-1">
          {{ $t('projects.modules.addDocument') }}
        </p>
        <Files :files="directory.documents" v-on:close="isDocsOpen = false" :documents="true"></Files>
      </b-collapse>
    </b-card>

    <!-- Here's the collapsable area with the directories, uses vue draggable https://github.com/SortableJS/Vue.Draggable -->
    <b-collapse :visible="isExpanded" id="collapse-directories">
      <draggable v-if="isExpanded" v-model="directory.directories" @update="updateDraggable" :options="draggableOptions">
          <!-- We need to use a key here so vue can keep track of the directories' identities https://vuejs.org/v2/guide/list.html#key -->
          <Directory
            v-for="(subdirectory, directoryIndex) in directory.directories"
            :key="subdirectory.id"
            :directory="subdirectory"
            :directoryNumbers="getDirectories()"
            :index="index"
            class="sub-directory ml-5 directory-list-item"
            v-on:structureChange="$emit('structureChange')">
          </Directory>
      </draggable>
    </b-collapse>

    <b-modal :lazy="true" id="info-modal" class="ignore-drag" v-model="infoShow" title="Module Translations">
      <div class="info" align="center">
        <b-table striped hover
                   :items="items"
                   :fields="fields"
                   class="table-responsive"
        >
          <template slot="actions" scope="item">
            <b-btn size="sm" @click="details(item.item)">{{ $t('common.edit')}}</b-btn>
          </template>
        </b-table>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { Directory } from '../../vuex/modules/structure/Directory'
import { mapGetters } from 'vuex'
import ChevronToggle from '../ui/ChevronToggle'
import draggable from 'vuedraggable'
import Files from './Files'

export default {
  name: 'Directory',
  components: {
    Files,
    ChevronToggle,
    FileList,
    draggable
  },
  props: {
    directory: {
      type: Object,
      default: new Directory({})
    },
    directoryNumbers: {
      type: Array,
      default: () => [] // Use a function to return an array/object https://github.com/vuejs/vue/issues/1032
    },
    isModule: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isFilesOpen: false, // Is the files list open?
      isDocsOpen: false, // Is the documents list open?
      isExpanded: false, // Are the child directories viewable?
      editTitle: false,
      infoShow: false,
      title: '',
      draggableOptions: {
        filter: '.ignore-drag',
        animation: 150
      },
      items: [
        {code: 'ESP', name: 'Spanish', translated: 47}
      ],
      fields: {
        code: {
          label: '',
          sortable: true
        },
        name: {
          label: 'Language',
          sortable: true
        },
        translated: {
          label: '% Translated',
          sortable: true
        },
        actions: {
          label: ''
        }
      }
    }
  },
  mounted () {
    // Set title from translation.. using the base language
    // Get the base language
    let baseLanguage = this.getProjectById(parseInt(this.$route.params.id)).baseLanguage
    if (baseLanguage && this.directory.translations.length > 0) {
      let translation = this.directory.translations.find(trans => trans.language === baseLanguage)
      if (translation) {
        this.title = translation.title
      }
    }
  },
  methods: {
    openMetadataModal (directoryId, metadata) {
      this.$root.$emit('openMetadataModal', {directoryId, metadata})
    },
    openFileSelectModal () {
      this.$root.$emit('openFileSelectModal', this.directory)
    },
    openDocumentModal () {
      this.$root.$emit('openDocumentSelectModal', this.directory)
    },
    addDirectory () {
      if (this.directory.id !== null) {
        this.isExpanded = true
        this.directory.addDirectoryAtIndex({index: this.index})
        this.$store.dispatch('SET_FLAT_STRUCTURE')
        this.$emit('structureChange')
      }
    },
    updateCritical (value) {
      this.directory.critical = value.value
    },
    updateDraggable (e) {
      this.$emit('structureChange')
      let newIndex = e.newIndex
      let oldIndex = e.oldIndex

      this.$store.dispatch('UPDATE_ORDER', {newIndex, oldIndex, directoryNumbers: this.getDirectories()})
    },
    updateText (newRevision) {
      this.editTitle = false
      this.$store.dispatch('UPDATE_DIRECTORY_TITLE', {
        directoryId: this.directory.id,
        lang: this.getProjectById(parseInt(this.$route.params.id)).baseLanguage,
        title: this.title,
        newRevision: newRevision
      }).then(() => {
        this.$notifications.notify(
          {
            message: `<b>${this._i18n.t('common.saved')}</b><br /> ${this._i18n.t('common.updated')}`,
            icon: 'info',
            horizontalAlign: 'right',
            verticalAlign: 'bottom',
            type: 'info'
          })
      }).catch(() => {
        this.$notifications.notify(
          {
            message: `<b>${this._i18n.t('common.oops')}</b><br /> ${this._i18n.t('common.error')}`,
            icon: 'exclamation-triangle',
            horizontalAlign: 'right',
            verticalAlign: 'bottom',
            type: 'danger'
          })
      })
    },
    removeDirectory () {
      if (this.$auth.check(['admin', 'editor'])) {
        this.$swal({
          title: this._i18n.t('common.areYouSure'),
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#6200ff',
          cancelButtonColor: '#f85e78',
          confirmButtonText: this._i18n.t('common.deleteIt'),
          allowOutsideClick: false
        }).then(() => {
          this.$store.dispatch('REMOVE_DIRECTORY', {directoryNumbers: this.directoryNumbers, directory: this.directory})
          this.isExpanded = false
          this.$emit('structureChange')
        }).catch(this.$swal.noop)
      } else {
        this.$swal({
          title: this._i18n.t('common.oops'),
          text: this._i18n.t('common.noPermission'),
          type: 'info'
        })
      }
    },
    toggleDirectory (value) {
      this.isExpanded = value
    },
    getDirectories () {
      return [...this.directoryNumbers, this.directory.order]
    }
  },
  computed: {
    isShown () {
      if (this.isModule && this.$auth.check(['admin', 'editor'])) {
        return true
      }
      return false
    },
    ...mapGetters([
      'getProjectById'
    ])
  }
}
</script>
