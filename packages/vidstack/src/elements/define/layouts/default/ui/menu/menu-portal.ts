import { html, type TemplateResult } from 'lit-html';
import { effect, type ReadSignal } from 'maverick.js';
import { isString, setAttribute } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { useMediaState } from '../../../../../../core/api/media-context';
import { watchColorScheme } from '../../../../../../utils/dom';
import { $signal } from '../../../../../lit/directives/signal';

export function MenuPortal(
  container: ReadSignal<string | HTMLElement | null>,
  template: TemplateResult,
) {
  return html`
    <media-menu-portal .container=${$signal(container)} disabled="fullscreen">
      ${template}
    </media-menu-portal>
  `;
}

export function createMenuContainer(layoutElement: Element, className: string, isSmallLayout: ReadSignal<boolean>) {
  let container = document.querySelector<HTMLElement>(`body > .${className}`);

  if (!container) {
    container = document.createElement('div');
    container.style.display = 'contents';
    container.classList.add(className);
    layoutElement.after(container);
  }

  // Default to body.
  if (!root) root = document.body;

  const container = document.createElement('div');
  container.style.display = 'contents';
  container.classList.add(className);
  root.append(container);

  effect(() => {
    if (!container) return;

    const { viewType } = useMediaState(),
      isSmall = isSmallLayout();

    setAttribute(container, 'data-view-type', viewType());
    setAttribute(container, 'data-sm', isSmall);
    setAttribute(container, 'data-lg', !isSmall);
    setAttribute(container, 'data-size', isSmall ? 'sm' : 'lg');
  });

  const { colorScheme } = useDefaultLayoutContext();
  watchColorScheme(container, colorScheme);

  return container;
}
