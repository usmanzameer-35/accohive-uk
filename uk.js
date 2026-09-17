const refreshIcons = () => {
  if (window.lucide) window.lucide.createIcons();
};

refreshIcons();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => {
  if (reducedMotion) element.classList.add('visible');
  else revealObserver.observe(element);
});

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.querySelector('.sr-only').textContent = isOpen ? 'Close menu' : 'Open menu';
});
mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.querySelector('.sr-only')?.replaceChildren(document.createTextNode('Open menu'));
}));

const header = document.querySelector('[data-header]');
window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 24), { passive: true });

const capabilityTabs = [...document.querySelectorAll('.capability-tab')];
const capabilityPanels = [...document.querySelectorAll('.capability-panel')];
const selectCapability = (index) => {
  const selected = capabilityTabs[index];
  if (!selected) return;
  capabilityTabs.forEach((tab, tabIndex) => {
    const isSelected = tabIndex === index;
    tab.classList.toggle('active', isSelected);
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });
  capabilityPanels.forEach((panel) => { panel.hidden = panel.id !== selected.getAttribute('aria-controls'); });
  refreshIcons();
};
capabilityTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCapability(index));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? capabilityTabs.length - 1 : event.key.includes('Down') || event.key.includes('Right') ? (index + 1) % capabilityTabs.length : (index - 1 + capabilityTabs.length) % capabilityTabs.length;
    selectCapability(next);
    capabilityTabs[next].focus();
  });
});

const timelineItems = [...document.querySelectorAll('.timeline-item')];
const timelineDetail = document.querySelector('.timeline-detail');
const timelineStages = [
  ['Understand where delivery capacity is under pressure.', 'We map your current workflows, systems, review points and the work you want to move through a managed delivery model.'],
  ['Shape the right operating model.', 'Together we define the workstream, responsibilities, handoffs and controls that fit your practice.'],
  ['Make your way of working repeatable.', 'Your terminology, standards, preferred tools and review expectations become part of a shared delivery language.'],
  ['Prove the motion on real work.', 'A focused pilot lets both teams tune handoffs, surface edge cases and build confidence before expanding.'],
  ['Run the agreed workstream.', 'AccoHive delivers inside the agreed rhythm, with visible ownership, communication and review points.'],
  ['Keep quality visible.', 'Work passes through the agreed quality checks and returns to your practice ready for its review.'],
  ['Turn learnings into better process.', 'Feedback, issue tracking and regular review make the playbook sharper over time.'],
  ['Expand capacity with control.', 'Extend the relationship into new workstreams when the operating model and delivery requirements support it.'],
];
const selectStage = (index) => {
  const item = timelineItems[index];
  if (!item || !timelineDetail) return;
  timelineItems.forEach((stage, stageIndex) => {
    const isSelected = stageIndex === index;
    stage.classList.toggle('active', isSelected);
    stage.setAttribute('aria-selected', String(isSelected));
  });
  const [title, text] = timelineStages[index];
  timelineDetail.querySelector('.panel-index').textContent = `STAGE ${String(index + 1).padStart(2, '0')} / 08`;
  timelineDetail.querySelector('h3').textContent = title;
  timelineDetail.querySelector('p').textContent = text;
  const progress = `${(index / (timelineItems.length - 1)) * 100}%`;
  const progressLine = document.querySelector('.timeline-rail span');
  if (window.innerWidth <= 700) progressLine?.style.setProperty('height', progress);
  else progressLine?.style.setProperty('width', progress);
};
timelineItems.forEach((item, index) => {
  item.addEventListener('click', () => selectStage(index));
  item.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (index + 1) % timelineItems.length : (index - 1 + timelineItems.length) % timelineItems.length;
    selectStage(next);
    timelineItems[next].focus();
  });
});

window.addEventListener('resize', () => selectStage(timelineItems.findIndex((item) => item.classList.contains('active'))), { passive: true });
selectStage(0);
