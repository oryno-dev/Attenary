import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Element structure representation
interface ElementNode {
  uid: number;
  selector: string;
  children?: ElementNode[];
  textContent?: string;
  parentUid?: number;
}

// Create the element structure based on the provided information
const createElementStructure = (): ElementNode => {
  // Child elements
  const child1: ElementNode = {
    uid: 6786,
    selector: '.css-view-g5y9jx.r-alignItems-1awozwy.r-marginBottom-1peese0',
    parentUid: 6788,
    children: []
  };

  const child2: ElementNode = {
    uid: 6787,
    selector: '.css-view-g5y9jx.r-alignItems-1awozwy.r-justifyContent-1777fci.r-left-1wyvozj.r-position-u8s1d.r-top-1v2oles.r-transform-ctuozw',
    parentUid: 6788,
    children: []
  };

  // Main element (uid: 6788)
  const mainElement: ElementNode = {
    uid: 6788,
    selector: '.css-view-g5y9jx.r-alignItems-1awozwy.r-justifyContent-1h0z5md.r-paddingTop-1knelpx.r-position-bnwqim.r-width-13qz1uu.r-zIndex-pezta',
    parentUid: 6846,
    children: [child1, child2]
  };

  // Parent element (uid: 6846)
  const parentElement: ElementNode = {
    uid: 6846,
    selector: '.css-view-g5y9jx.r-marginBottom-1ifxtd0.r-position-bnwqim',
    children: [mainElement]
  };

  return mainElement;
};

// Individual element component
const ElementComponent: React.FC<{ element: ElementNode; level?: number }> = ({ 
  element, 
  level = 0 
}) => {
  const indent = '  '.repeat(level);
  
  return (
    <View style={styles.elementContainer}>
      <Text style={styles.elementInfo}>
        {indent}Element (uid: {element.uid})
      </Text>
      <Text style={styles.selector}>
        {indent}Selector: {element.selector}
      </Text>
      {element.textContent && (
        <Text style={styles.textContent}>
          {indent}Text: {element.textContent}
        </Text>
      )}
      {element.children && element.children.length > 0 && (
        <Text style={styles.childrenInfo}>
          {indent}Children: {element.children.length} element nodes
        </Text>
      )}
      {element.children?.map((child) => (
        <ElementComponent key={child.uid} element={child} level={level + 1} />
      ))}
    </View>
  );
};

// Visual representation component
const VisualElement: React.FC<{ element: ElementNode }> = ({ element }) => {
  return (
    <View style={styles.visualContainer}>
      <View style={styles.parentElement}>
        <Text style={styles.parentLabel}>Parent (uid: 6846)</Text>
        <View style={styles.mainElement}>
          <Text style={styles.elementLabel}>Main Element (uid: 6788)</Text>
          <View style={styles.childContainer}>
            <View style={[styles.childElement, styles.child1]}>
              <Text style={styles.childLabel}>Child 1 (uid: 6786)</Text>
            </View>
            <View style={[styles.childElement, styles.child2]}>
              <Text style={styles.childLabel}>Child 2 (uid: 6787)</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Main demo component
const ElementStructureDemo: React.FC = () => {
  const elementStructure = createElementStructure();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Element Structure Analysis</Text>
      
      <Text style={styles.sectionTitle}>1. Element Information:</Text>
      <ElementComponent element={elementStructure} />
      
      <Text style={styles.sectionTitle}>2. Visual Structure:</Text>
      <VisualElement element={elementStructure} />
      
      <Text style={styles.sectionTitle}>3. Summary:</Text>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>• Element uid: 6788</Text>
        <Text style={styles.summaryText}>• Has 2 child element nodes (6786, 6787)</Text>
        <Text style={styles.summaryText}>• No child text nodes</Text>
        <Text style={styles.summaryText}>• Parent uid: 6846</Text>
        <Text style={styles.summaryText}>• Parent has only 1 child element node</Text>
      </View>

      <Text style={styles.sectionTitle}>4. CSS Classes Analysis:</Text>
      <View style={styles.cssAnalysis}>
        <Text style={styles.cssText}>Main element classes:</Text>
        <Text style={styles.cssClass}>• css-view-g5y9jx (base view)</Text>
        <Text style={styles.cssClass}>• r-alignItems-1awozwy (align items)</Text>
        <Text style={styles.cssClass}>• r-justifyContent-1h0z5md (justify content)</Text>
        <Text style={styles.cssClass}>• r-paddingTop-1knelpx (padding top)</Text>
        <Text style={styles.cssClass}>• r-position-bnwqim (position)</Text>
        <Text style={styles.cssClass}>• r-width-13qz1uu (width)</Text>
        <Text style={styles.cssClass}>• r-zIndex-pezta (z-index)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#555',
  },
  elementContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  elementInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  selector: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  textContent: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  childrenInfo: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  visualContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  parentElement: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  parentLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 10,
  },
  mainElement: {
    backgroundColor: '#f3e5f5',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#9C27B0',
    marginHorizontal: 20,
  },
  elementLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B1FA2',
    textAlign: 'center',
    marginBottom: 15,
  },
  childContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  childElement: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  child1: {
    backgroundColor: '#fff3e0',
    borderColor: '#FF9800',
  },
  child2: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  childLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  cssAnalysis: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  cssText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  cssClass: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
    fontFamily: 'monospace',
  },
});

export default ElementStructureDemo;