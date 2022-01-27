#!/usr/bin/env node

const NodeMediaServer = require('..');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 20000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
    ssl: {
      port: 443,
      key: './bin/privatekey.pem',
      cert: './bin/certificate.pem',
    },
  },
  http: {
    port: 8000,
    mediaroot: './media',
    allow_origin: '*',
  },
  https: {
    port: 8443,
    mediaroot: './media',
    key: './bin/privatekey.pem',
    cert: './bin/certificate.pem',
    allow_origin: '*',
  },
  trans: {
    ffmpeg: '/usr/local/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        // dash: true,
        // dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
      },
    ],
  },
  transAuthCallback: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  },
};

var nms = new NodeMediaServer(config);
nms.run();

nms.on('preConnect', async (id, args) => {
  console.log(
    '[NodeEvent on preConnect]',
    `id=${id} args=${JSON.stringify(args)}`
  );

  //   if (!args.tcUrl) {
  //     await new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         console.log('REJECT!!');
  //         let session = nms.getSession(id);
  //         session.reject();
  //       }, 3000);
  //     });
  //   }
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postConnect', (id, args) => {
  console.log('POSTCONNECT');
});

nms.on('doneConnect', (id, args) => {
  console.log('doneConnect');
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('prePublish', StreamPath, args);

  // reject invalid streamer
  if (!args.auth || args.auth != 'mysecret') {
    nms.getSession(id).reject();
  }
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('prePublish');
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('donePublish');
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log(`prePlay: args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('postPlay');
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on donePlay]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});

// const NodeMediaServer = require('..');
// let argv = require('minimist')(process.argv.slice(2),
//   {
//     string:['rtmp_port','http_port','https_port'],
//     alias: {
//       'rtmp_port': 'r',
//       'http_port': 'h',
//       'https_port': 's',
//     },
//     default:{
//       'rtmp_port': 1935,
//       'http_port': 8000,
//       'https_port': 8443,
//     }
//   });

// if (argv.help) {
//   console.log('Usage:');
//   console.log('  node-media-server --help // print help information');
//   console.log('  node-media-server --rtmp_port 1935 or -r 1935');
//   console.log('  node-media-server --http_port 8000 or -h 8000');
//   console.log('  node-media-server --https_port 8443 or -s 8443');
//   process.exit(0);
// }

// const config = {
//   rtmp: {
//     port: argv.rtmp_port,
//     chunk_size: 60000,
//     gop_cache: true,
//     ping: 30,
//     ping_timeout: 60,
//     // ssl: {
//     //   port: 443,
//     //   key: __dirname+'/privatekey.pem',
//     //   cert: __dirname+'/certificate.pem',
//     // }
//   },
//   http: {
//     port: argv.http_port,
//     mediaroot: __dirname+'/media',
//     webroot: __dirname+'/www',
//     allow_origin: '*',
//     api: true
//   },
//   https: {
//     port: argv.https_port,
//     key: __dirname+'/privatekey.pem',
//     cert: __dirname+'/certificate.pem',
//   },
//   auth: {
//     api: true,
//     api_user: 'admin',
//     api_pass: 'admin',
//     play: false,
//     publish: false,
//     secret: 'nodemedia2017privatekey'
//   }
// };

// let nms = new NodeMediaServer(config);
// nms.run();

// nms.on('preConnect', (id, args) => {
//   console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
//   // let session = nms.getSession(id);
//   // session.reject();
// });

// nms.on('postConnect', (id, args) => {
//   console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
// });

// nms.on('doneConnect', (id, args) => {
//   console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
// });

// nms.on('prePublish', (id, StreamPath, args) => {
//   console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
//   // let session = nms.getSession(id);
//   // session.reject();
// });

// nms.on('postPublish', (id, StreamPath, args) => {
//   console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
// });

// nms.on('donePublish', (id, StreamPath, args) => {
//   console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
// });

// nms.on('prePlay', (id, StreamPath, args) => {
//   console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
//   // let session = nms.getSession(id);
//   // session.reject();
// });

// nms.on('postPlay', (id, StreamPath, args) => {
//   console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
// });

// nms.on('donePlay', (id, StreamPath, args) => {
//   console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
// });
