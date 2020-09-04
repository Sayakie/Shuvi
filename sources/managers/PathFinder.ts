import { join as joins } from 'path'

function join(...paths: string[]) {
  return joins($root, '/', ...paths)
}

function joinFromProject(...paths: string[]) {
  return joins($project, '/', ...paths)
}

const $root = process.cwd()
const $project = joins( __dirname, '../' )
const $config = joins($project, 'config')
const pkg = join('package.json')
const version = import( pkg )
  .then(({ version }) => (version as unknown) as string)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .catch(_ => 'unknown version')
const constants = joinFromProject('config/Constants')

export { $root, $project, $config, pkg, version, constants }
