import React from 'react';
import {renderToString} from 'react-dom/server';
import {FullProject} from './full-project-entry';
export function renderProject(id:string){return renderToString(<FullProject id={id}/>)}
