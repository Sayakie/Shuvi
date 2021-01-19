import PrettyError from 'pretty-error'

const { NODE_ENV } = process.env

if (NODE_ENV === 'production') {
  /*
    do nothing
    todo run some task
  */
} else {
  const pe = new PrettyError().start()
  pe.appendStyle({
    'pretty-error > header > message': {
      color: 'bright-white',
      background: 'cyan',
      padding: '0 1'
    },
    'pretty-error > trace > item': { marginLeft: 2, bullet: '"<grey>o</grey>"' },
    'pretty-error > trace > item > header > pointer > file': {
      color: 'bright-cyan'
    },
    'pretty-error > trace > item > header > pointer > colon': {
      color: 'cyan'
    },
    'pretty-error > trace > item > header > pointer > line': {
      color: 'bright-cyan'
    },
    'pretty-error > trace > item > header > what': {
      color: 'bright-white'
    },
    'pretty-error > trace > item > footer > addr': {
      display: 'none'
    }
  })
}
