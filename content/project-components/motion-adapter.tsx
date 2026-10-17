import React from 'react';
export const useReducedMotion=()=>true;
export const motion=new Proxy({}, {get:(_target,tag:string)=>React.forwardRef((props:any,ref:any)=>{const {initial,animate,exit,transition,whileInView,viewport,whileHover,whileTap,layout,...rest}=props;return React.createElement(tag,{...rest,ref})})});
