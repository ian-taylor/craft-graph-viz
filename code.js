function getEdge(source, target) {
  return {
    data: {
      source: source,
      target: target,
      faveColor: '#3a3537',
      strength: 90
    }
  };

}

function getCoseStyle() {

  return [{
    "selector": "core",
    "style": {
      "selection-box-color": "#1b4282",
      "selection-box-border-color": "#1b4282",
      "selection-box-opacity": "0.5"
    }
  }, {
    "selector": "node",
    "style": {
      "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
      "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
      "content": "data(name)",
      "font-size": "12px",
      "text-valign": "center",
      "text-halign": "center",
      "background-color": "#285296",
      "text-outline-color": "#285296",
      "text-outline-width": "2px",
      "color": "#fff",
      "overlay-padding": "6px",
      "z-index": "10"
    }
  }, {
    "selector": "node[?attr]",
    "style": {
      "shape": "rectangle",
      "background-color": "#aaa",
      "text-outline-color": "#aaa",
      "width": "16px",
      "height": "16px",
      "font-size": "6px",
      "z-index": "1"
    }
  }, {
    "selector": "node[?query]",
    "style": {"background-clip": "none", "background-fit": "contain"}
  }, {
    "selector": "node:selected",
    "style": {
      "border-width": "6px",
      "border-color": "#AAD8FF",
      "border-opacity": "0.5",
      "background-color": "#77828C",
      "text-outline-color": "#77828C"
    }
  }, {
    "selector": "edge",
    "style": {
      "curve-style": "haystack",
      "haystack-radius": "0.5",
      "opacity": "0.4",
      "line-color": "#4c4e51",
      "width": "mapData(weight, 0, 1, 1, 8)",
      "overlay-padding": "3px"
    }
  }, {"selector": "node.unhighlighted", "style": {"opacity": "0.2"}}, {
    "selector": "edge.unhighlighted",
    "style": {"opacity": "0.05"}
  }, {"selector": ".highlighted", "style": {"z-index": "999999"}}, {
    "selector": "node.highlighted",
    "style": {
      "border-width": "6px",
      "border-color": "#AAD8FF",
      "border-opacity": "0.5",
      "background-color": "#394855",
      "text-outline-color": "#394855",
      "shadow-blur": "12px",
      "shadow-color": "#000",
      "shadow-opacity": "0.8",
      "shadow-offset-x": "0px",
      "shadow-offset-y": "4px"
    }
  }, {"selector": "edge.filtered", "style": {"opacity": "0"}}, {
    "selector": "edge[group=\"coexp\"]",
    "style": {"line-color": "#d0b7d5"}
  }, {"selector": "edge[group=\"coloc\"]", "style": {"line-color": "#a0b3dc"}}, {
    "selector": "edge[group=\"gi\"]",
    "style": {"line-color": "#90e190"}
  }, {"selector": "edge[group=\"path\"]", "style": {"line-color": "#9bd8de"}}, {
    "selector": "edge[group=\"pi\"]",
    "style": {"line-color": "#eaa2a2"}
  }, {"selector": "edge[group=\"predict\"]", "style": {"line-color": "#f6c384"}}, {
    "selector": "edge[group=\"spd\"]",
    "style": {"line-color": "#dad4a2"}
  }, {"selector": "edge[group=\"spd_attr\"]", "style": {"line-color": "#D0D0D0"}}, {
    "selector": "edge[group=\"reg\"]",
    "style": {"line-color": "#D0D0D0"}
  }, {
    "selector": "edge[group=\"reg_attr\"]",
    "style": {"line-color": "#D0D0D0"}
  }, {"selector": "edge[group=\"user\"]", "style": {"line-color": "#f0ec86"}}];

}

function getColorfulStyle() {

  return   cytoscape.stylesheet()
      .selector('node')
      .css({
        'shape': 'data(faveShape)',
        'width': 'mapData(weight, 40, 80, 20, 60)',
        'content': 'data(name)',
        'text-valign': 'center',
        'text-outline-width': 2,
        'text-outline-color': 'data(faveColor)',
        'background-color': 'data(faveColor)',
        'color': '#fff'
      })
      .selector(':selected')
      .css({
        'border-width': 3,
        'border-color': '#333'
      })
      .selector('edge')
      .css({
        'curve-style': 'bezier',
        'opacity': 0.666,
        'width': 'mapData(strength, 70, 100, 2, 6)',
        'target-arrow-shape': 'triangle',
        'source-arrow-shape': 'circle',
        'line-color': 'data(faveColor)',
        'source-arrow-color': 'data(faveColor)',
        'target-arrow-color': 'data(faveColor)'
      })
      .selector('edge.questionable')
      .css({
        'line-style': 'dotted',
        'target-arrow-shape': 'diamond'
      })
      .selector('.faded')
      .css({
        'opacity': 0.25,
        'text-opacity': 0
      });
}

function loadFlow() {
  window.flow = {};
  window.flow['name'] = window.graphData['name'];

  window.flow['elements'] = {};
  window.flow.elements['nodes'] = [];
  window.flow.elements['edges'] = [];

  var outputNodeMapper = {};

  var stages = window.graphData['stages']; // have 'id' and 'name' attributes

  var user = {
    data: {
      id: 'user',
      name: 'User',
      weight: 65,
      faveColor: '#962850',
      faveShape: 'rectangle'
    }
  };

  window.flow.elements.nodes.push(user);

  for (var i = 0, len = stages.length; i < len; i++) {
    var stage = stages[i];
    var node = {
      data: {
        id: stage['id'],
        name: stage['name'],
        weight: 65,
        faveColor: '#285296',
        faveShape: 'ellipse'
      }
    };
    window.flow.elements.nodes.push(node);

    var f;
    var outputs =  stage['outputs'];

    for (var output = 0, olen = outputs.length; output < olen; output++) {
      var out = outputs[output];
      var ofiles = out['files'];
      for (f = 0, len = ofiles.length; f < len; f++) {
        var file = ofiles[f];
        outputNodeMapper[file['id']] = stage['id']; // maps output nodes to stage
      }
    }

    var inputs =  stage['inputs'];

    for (var input = 0, ilen = inputs.length; input < ilen; input++) {
      var inp = inputs[input];
      var files = inp['files'];
      for (f = 0, len = files.length; f < len; f++) {
        var of = files[f];
        if (of.hasOwnProperty('output-id')) { // connected to an output node...
            var output_id = of['output-id'];
            var outputStageName = outputNodeMapper[output_id];
            var new_connection = getEdge(outputStageName, stage['id']);
            window.flow.elements.edges.push(new_connection);
        } else { // connected to a user
          new_connection = getEdge("user", stage['id']);
          window.flow.elements.edges.push(new_connection);
        }
        }
      }
  }
}

loadFlow();

console.log(window.flow.elements);

document.addEventListener('DOMContentLoaded', function(){ // on dom ready
  var cy = cytoscape({
  container: document.querySelector('#cy'),

  boxSelectionEnabled: false,
  autounselectify: true,
  
  // style: cytoscape.stylesheet()
  //   .selector('node')
  //     .css({
  //       'content': 'data(name)',
  //       'text-valign': 'center',
  //       'color': 'white',
  //       'text-outline-width': 2,
  //       'background-color': '#4687E2',
  //       'text-outline-color': '#4687E2'
  //     })
  //   .selector('edge')
  //     .css({
  //       'curve-style': 'bezier',
  //       'target-arrow-shape': 'triangle',
  //       'target-arrow-color': '#4687E2',
  //       'line-color': '#4687E2',
  //       'width': 1
  //     })
  //   .selector(':selected')
  //     .css({
  //       'background-color': 'black',
  //       'line-color': 'black',
  //       'target-arrow-color': 'black',
  //       'source-arrow-color': 'black'
  //     })
  //   .selector('.faded')
  //     .css({
  //       'opacity': 0.25,
  //       'text-opacity': 0
  //     }),


    style: getColorfulStyle(),

    elements: window.flow.elements,

    layout: {
      name: 'cose',
      padding: 10,
      randomize: true
    },


    // layout: {
  //   name: 'grid',
  //   padding: 10
  // }
});

cy.on('tap', 'node', function(e){
  var node = e.cyTarget; 
  var neighborhood = node.neighborhood().add(node);
  
  cy.elements().addClass('faded');
  neighborhood.removeClass('faded');
});

cy.on('tap', function(e){
  if( e.cyTarget === cy ){
    cy.elements().removeClass('faded');
  }
});

}); // on dom ready