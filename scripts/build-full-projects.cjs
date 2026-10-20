const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const original=path.resolve(root,'../tan-can-site/node_modules');
let esbuild;try{esbuild=require('esbuild')}catch{esbuild=require(path.join(original,'esbuild'))}
const adapter={name:'existing-component-adapters',setup(build){build.onResolve({filter:/^framer-motion$/},()=>({path:path.join(root,'content/project-components/motion-adapter.tsx')}));build.onResolve({filter:/^@\/components\/ui\/slider$/},()=>({path:path.join(root,'content/project-components/slider-adapter.tsx')}));}};
(async()=>{const shared={entryPoints:[path.join(root,'content/full-project-entry.tsx')],bundle:true,jsx:'automatic',nodePaths:[path.join(root,'node_modules'),original],plugins:[adapter],define:{'process.env.NODE_ENV':'"production"'},logLevel:'warning'};
await esbuild.build({...shared,platform:'browser',format:'iife',outfile:path.join(root,'assets/full-project.js'),minify:true});
await esbuild.build({...shared,entryPoints:[path.join(root,'content/full-project-renderer.tsx')],platform:'node',format:'cjs',outfile:path.join(root,'audit/full-project-renderer.cjs')});
const {renderProject}=require(path.join(root,'audit/full-project-renderer.cjs'));const projects=JSON.parse(fs.readFileSync(path.join(root,'projects.json')));
const fragments={};for(const p of projects){fragments[p.id]=renderProject(p.id)}fs.writeFileSync(path.join(root,'content/full-project-fragments.json'),JSON.stringify(fragments));console.log('Rendered and bundled full original components for',projects.length,'project routes.');})().catch(e=>{console.error(e);process.exitCode=1});
