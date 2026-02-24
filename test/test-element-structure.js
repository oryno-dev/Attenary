// Test file for element structure validation and analysis

// Element structure interface (matching the TypeScript version)
class ElementNode {
  constructor(uid, selector, children = [], textContent = null, parentUid = null) {
    this.uid = uid;
    this.selector = selector;
    this.children = children;
    this.textContent = textContent;
    this.parentUid = parentUid;
  }

  // Get the depth of this element in the tree
  getDepth() {
    if (!this.children || this.children.length === 0) return 1;
    return 1 + Math.max(...this.children.map(child => child.getDepth()));
  }

  // Check if element has child element nodes
  hasElementChildren() {
    return this.children && this.children.length > 0;
  }

  // Check if element has text content
  hasTextContent() {
    return this.textContent && this.textContent.trim().length > 0;
  }

  // Get all descendant elements
  getAllDescendants() {
    if (!this.children || this.children.length === 0) return [];
    
    let descendants = [...this.children];
    this.children.forEach(child => {
      descendants = descendants.concat(child.getAllDescendants());
    });
    return descendants;
  }

  // Validate the structure matches the requirements
  validateStructure() {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check if this is the main element (uid: 6788)
    if (this.uid === 6788) {
      // Should have exactly 2 child element nodes
      if (this.children.length !== 2) {
        validation.errors.push(`Main element should have exactly 2 children, found ${this.children.length}`);
        validation.isValid = false;
      }

      // Should not have text content
      if (this.hasTextContent()) {
        validation.errors.push('Main element should not have text content');
        validation.isValid = false;
      }

      // Check child UIDs
      const childUids = this.children.map(child => child.uid);
      if (!childUids.includes(6786)) {
        validation.errors.push('Missing child element with uid 6786');
        validation.isValid = false;
      }
      if (!childUids.includes(6787)) {
        validation.errors.push('Missing child element with uid 6787');
        validation.isValid = false;
      }
    }

    // Check if this is the parent element (uid: 6846)
    if (this.uid === 6846) {
      // Should have exactly 1 child element node (the main element)
      if (this.children.length !== 1) {
        validation.errors.push(`Parent element should have exactly 1 child, found ${this.children.length}`);
        validation.isValid = false;
      }
    }

    // Validate selector format
    if (!this.selector.startsWith('.css-view-g5y9jx')) {
      validation.warnings.push(`Element ${this.uid} selector doesn't start with expected base class`);
    }

    return validation;
  }

  // Convert to readable format
  toString(indent = 0) {
    const spaces = '  '.repeat(indent);
    let result = `${spaces}Element (uid: ${this.uid})\n`;
    result += `${spaces}  Selector: ${this.selector}\n`;
    
    if (this.textContent) {
      result += `${spaces}  Text: ${this.textContent}\n`;
    }
    
    if (this.children.length > 0) {
      result += `${spaces}  Children: ${this.children.length} element nodes\n`;
      this.children.forEach(child => {
        result += child.toString(indent + 1);
      });
    }
    
    return result;
  }
}

// Create the element structure
function createElementStructure() {
  // Child elements
  const child1 = new ElementNode(
    6786,
    '.css-view-g5y9jx.r-alignItems-1awozwy.r-marginBottom-1peese0',
    [],
    null,
    6788
  );

  const child2 = new ElementNode(
    6787,
    '.css-view-g5y9jx.r-alignItems-1awozwy.r-justifyContent-1777fci.r-left-1wyvozj.r-position-u8s1d.r-top-1v2oles.r-transform-ctuozw',
    [],
    null,
    6788
  );

  // Main element (uid: 6788)
  const mainElement = new ElementNode(
    6788,
    '.css-view-g5y9jx.r-alignItems-1awozwy.r-justifyContent-1h0z5md.r-paddingTop-1knelpx.r-position-bnwqim.r-width-13qz1uu.r-zIndex-pezta',
    [child1, child2],
    null,
    6846
  );

  // Parent element (uid: 6846)
  const parentElement = new ElementNode(
    6846,
    '.css-view-g5y9jx.r-marginBottom-1ifxtd0.r-position-bnwqim',
    [mainElement],
    null,
    null
  );

  return { mainElement, parentElement, child1, child2 };
}

// Analysis functions
function analyzeElementStructure() {
  console.log('=== Element Structure Analysis ===\n');
  
  const structure = createElementStructure();
  
  console.log('1. Element Tree Structure:');
  console.log(structure.parentElement.toString());
  
  console.log('\n2. Validation Results:');
  const validation = structure.mainElement.validateStructure();
  console.log(`Valid: ${validation.isValid}`);
  if (validation.errors.length > 0) {
    console.log('Errors:');
    validation.errors.forEach(error => console.log(`  - ${error}`));
  }
  if (validation.warnings.length > 0) {
    console.log('Warnings:');
    validation.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log('\n3. Statistics:');
  console.log(`Total elements: ${structure.parentElement.getAllDescendants().length + 1}`);
  console.log(`Tree depth: ${structure.parentElement.getDepth()}`);
  console.log(`Main element children: ${structure.mainElement.children.length}`);
  console.log(`Parent element children: ${structure.parentElement.children.length}`);
  
  console.log('\n4. CSS Class Analysis:');
  const allElements = [structure.mainElement, structure.child1, structure.child2];
  allElements.forEach(element => {
    const classes = element.selector.split('.').filter(cls => cls.length > 0);
    console.log(`Element ${element.uid}: ${classes.length} classes`);
    classes.forEach(cls => console.log(`  - ${cls}`));
  });
  
  console.log('\n5. Selector Pattern Analysis:');
  const baseClasses = ['css-view-g5y9jx'];
  const styleClasses = structure.mainElement.selector
    .split('.')
    .filter(cls => !baseClasses.includes(cls) && cls.length > 0);
  
  console.log('Base classes:', baseClasses.join(', '));
  console.log('Style classes:', styleClasses.join(', '));
  
  // Pattern analysis
  const patterns = {
    alignment: styleClasses.filter(cls => cls.includes('alignItems') || cls.includes('justifyContent')),
    positioning: styleClasses.filter(cls => cls.includes('position') || cls.includes('left') || cls.includes('top')),
    spacing: styleClasses.filter(cls => cls.includes('padding') || cls.includes('margin')),
    sizing: styleClasses.filter(cls => cls.includes('width') || cls.includes('height')),
    zIndex: styleClasses.filter(cls => cls.includes('zIndex')),
    transform: styleClasses.filter(cls => cls.includes('transform'))
  };
  
  console.log('\n6. Style Patterns:');
  Object.entries(patterns).forEach(([pattern, classes]) => {
    if (classes.length > 0) {
      console.log(`${pattern}: ${classes.join(', ')}`);
    }
  });
}

// Run the analysis
analyzeElementStructure();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ElementNode,
    createElementStructure,
    analyzeElementStructure
  };
}