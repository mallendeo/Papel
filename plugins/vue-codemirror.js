import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'

// Themes
// -------------------
import 'codemirror/lib/codemirror.css'

import 'codemirror/theme/material.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/oceanic-next.css'
import 'codemirror/theme/dracula.css'

import 'codemirror/theme/solarized.css'
import 'codemirror/theme/mdn-like.css'

// Languages
// -------------------
// html
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/pug/pug'

// css
import 'codemirror/mode/css/css'
import 'codemirror/mode/stylus/stylus'

// js
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jsx/jsx'

import 'codemirror/addon/selection/active-line'

Vue.use(VueCodemirror)
