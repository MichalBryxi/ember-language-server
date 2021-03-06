import { extractTokensFromTemplate } from '../../src/utils/template-tokens-collector';

function t(tpl) {
  return extractTokensFromTemplate(tpl);
}

describe('TemplateTokensCollector', () => {
  it('extract tokens from inline angle components', () => {
    expect(t('<MyComponent />')).toEqual(['my-component']);
  });
  it('extract tokens from nested inline angle components', () => {
    expect(t('<MyComponent::Bar />')).toEqual(['my-component/bar']);
  });
  it('extract tokens from inline curly components', () => {
    expect(t('{{my-component}}')).toEqual(['my-component']);
  });
  it('extract tokens from nested inline curly components', () => {
    expect(t('{{my-component/bar}}')).toEqual(['my-component/bar']);
  });
  it('extract tokens from modifiers in html tags', () => {
    expect(t('<input {{autocomplete}} >')).toEqual(['autocomplete']);
  });
  it('extract tokens from modifiers in angle components', () => {
    expect(t('<MyComponent {{autocomplete}} />')).toEqual(['my-component', 'autocomplete']);
  });
  it('extract tokens from curly blocks', () => {
    expect(t('{{#my-component/foo}} {{/my-component/foo}}')).toEqual(['my-component/foo']);
  });
  it('extract tokens from angle blocks', () => {
    expect(t('<MyComponent::Foo></MyComponent::Foo>')).toEqual(['my-component/foo']);
  });
  it('extract tokens from helpers in attributes', () => {
    expect(t('<MyComponent::Foo @name={{format-name "boo"}}></MyComponent::Foo>')).toEqual(['my-component/foo', 'format-name']);
  });
  it('extract tokens from helpers composition in attributes', () => {
    expect(t('<MyComponent::Foo @name={{format-name (to-uppercase "boo")}}></MyComponent::Foo>')).toEqual(['my-component/foo', 'format-name', 'to-uppercase']);
  });
  it('extract tokens from helpers composition in params', () => {
    expect(t('{{#my-component/foo name=(format-name (to-uppercase "boo"))}} {{/my-component/foo}}')).toEqual([
      'my-component/foo',
      'format-name',
      'to-uppercase',
    ]);
  });
  it('skip local paths for angle blocks', () => {
    expect(t('<Foo as |Bar|><Bar /></Foo>')).toEqual(['foo']);
  });
  it('skip local paths for curly blocks', () => {
    expect(t('{{#foo-bar as |Bar|}}<Bar />{{/foo-bar}}')).toEqual(['foo-bar']);
  });
  it('skip external arguments', () => {
    expect(t('<@Foo />')).toEqual([]);
  });
});
