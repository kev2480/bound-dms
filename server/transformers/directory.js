module.exports = {
  transform: (directory) => {

    let metadata = {}
    directory.metatypes.forEach((metatype, index) => {

      let value = metatype.MetaValue.value
      if (metatype.type === 'boolean') {
        value = (value === '1')
      } else if (metatype.type === 'integer') {
        value = parseInt(value)
      }
      metadata[metatype.key] = value
    })

    return {
      id: directory.id,
      parentId: directory.parentId,
      projectId: directory.projectId,
      order: directory.order,
      createdAt: directory.createdAt,
      updatedAt: directory.updatedAt,
      createdBy: directory.createdBy,
      directories: directory.directories,
      files: directory.files,
      documents: directory.documents,
      translations: directory.translations,
      metadata: metadata
    }
  }
}
