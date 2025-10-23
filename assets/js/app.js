// app.js — funcionalidades avançadas para a plataforma ONG
// Recursos implementados:
// - Menu acessível (hamburguer) responsivo
// - Filtro dinâmico de projetos (busca + categoria)
// - Validação do formulário com integração ViaCEP
// - Modais e toasts simples
// - Máscaras para CPF/telefone/CEP
// - Smooth scroll para âncoras

document.addEventListener('DOMContentLoaded', function () {
  // helpers
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  // -------------------- Menu acessível (hamburger) --------------------
  (function setupHamburger(){
    const nav = qs('.main-nav');
    if(!nav) return;
    const navList = qs('.main-nav ul');
    if(!navList) return;

    let hamburger = qs('.hamburger');
    const headerContainer = qs('.site-header .container') || qs('.container');
    if(!hamburger && headerContainer){
      hamburger = document.createElement('button');
      hamburger.className = 'hamburger';
      hamburger.type = 'button';
      hamburger.setAttribute('aria-label','Abrir menu');
      hamburger.setAttribute('aria-expanded','false');
      hamburger.innerHTML = '<span></span><span></span><span></span>';
      headerContainer.insertBefore(hamburger, nav);
    }

    function closeMenu(){
      navList.classList.remove('open');
      if(hamburger) hamburger.setAttribute('aria-expanded','false');
    }

    hamburger.addEventListener('click', function(){
      const open = navList.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // fechar com Esc
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMenu();
    });

    // fechar ao clicar link (mobile)
    navList.addEventListener('click', function(e){
      if(e.target.tagName === 'A') closeMenu();
    });
  })();

  // -------------------- Smooth scroll para âncoras --------------------
  qsa('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      const href = a.getAttribute('href');
      if(href && href.length > 1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
          try{ target.focus({preventScroll:true}); }catch(err){}
        }
      }
    });
  });

  // -------------------- Filtro dinâmico de projetos --------------------
  (function setupProjectsFilter(){
    const filtersForm = qs('.filters');
    if(!filtersForm) return;
    const busca = qs('#busca', filtersForm);
    const categoria = qs('#categoria', filtersForm);
    const projects = qsa('.projects-list .project-card');
    if(projects.length === 0) return;

    // se faltar data-category, inferir por título/descrição
    projects.forEach(function(p){
      if(!p.dataset.category){
        const t = (qs('h3', p)?.textContent || '').toLowerCase();
        const d = (qs('p', p)?.textContent || '').toLowerCase();
        if(t.includes('capacit') || d.includes('capacita')) p.dataset.category = 'educacao';
        else if(t.includes('clínic') || t.includes('clinica') || d.includes('saúde') || d.includes('saude')) p.dataset.category = 'saude';
        else p.dataset.category = 'outros';
      }
    });

    function applyFilter(){
      const q = busca?.value.trim().toLowerCase() || '';
      const cat = categoria?.value || 'todas';
      projects.forEach(function(p){
        const title = (qs('h3', p)?.textContent || '').toLowerCase();
        const desc = (qs('p', p)?.textContent || '').toLowerCase();
        const matchesQ = q === '' || title.includes(q) || desc.includes(q);
        const matchesCat = cat === 'todas' || (p.dataset.category && p.dataset.category === cat);
        p.style.display = (matchesQ && matchesCat) ? '' : 'none';
      });
    }

    busca?.addEventListener('input', applyFilter);
    categoria?.addEventListener('change', applyFilter);
  })();

  // -------------------- Modal e Toasts (simples) --------------------
  function showToast(message, time){
    time = time || 3000;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;right:16px;bottom:16px;background:#222;color:#fff;padding:10px 14px;border-radius:8px;z-index:9999;box-shadow:0 6px 18px rgba(0,0,0,0.12)';
    document.body.appendChild(toast);
    setTimeout(function(){ toast.remove(); }, time);
  }

  function showConfirm(message){
    return new Promise(function(resolve){
      const modal = document.createElement('div');
      modal.className = 'modal active';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9998';
      const content = document.createElement('div');
      content.className = 'modal-content';
      content.style.cssText = 'background:#fff;padding:20px;border-radius:10px;max-width:480px;width:90%;box-shadow:0 10px 30px rgba(0,0,0,0.12)';
      content.innerHTML = '<p style="margin:0 0 12px">'+message+'</p>' +
        '<div style="display:flex;gap:8px;justify-content:flex-end">' +
        '<button class="btn btn-primary" id="confirm-ok">Confirmar</button>' +
        '<button class="btn btn-secondary" id="confirm-cancel">Cancelar</button>' +
        '</div>';
      modal.appendChild(content);
      document.body.appendChild(modal);

      qs('#confirm-ok', modal).addEventListener('click', function(){ document.body.removeChild(modal); resolve(true); });
      qs('#confirm-cancel', modal).addEventListener('click', function(){ document.body.removeChild(modal); resolve(false); });

      // close on esc
      function onKey(e){ if(e.key === 'Escape'){ document.body.removeChild(modal); resolve(false); document.removeEventListener('keydown', onKey); } }
      document.addEventListener('keydown', onKey);
    });
  }

  // -------------------- Formulário — ViaCEP, máscaras e submissão simulada --------------------
  (function setupForm(){
    const form = qs('#formCadastro');
    if(!form) return;
    const cep = qs('#cep', form);
    const endereco = qs('#endereco', form);
    const cidade = qs('#cidade', form);
    const estado = qs('#estado', form);

    // máscara simples para CEP, CPF, telefone
    function setInputFilter(el, func){ if(!el) return; el.addEventListener('input', function(){ this.value = func(this.value); }); }
    setInputFilter(qs('#cpf', form), function(v){ v = v.replace(/\D/g,'').slice(0,11); if(v.length>9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/,'$1.$2.$3-$4'); if(v.length>6) return v.replace(/(\d{3})(\d{3})(\d{0,3})/,'$1.$2.$3'); if(v.length>3) return v.replace(/(\d{3})(\d{0,3})/,'$1.$2'); return v; });
    setInputFilter(qs('#telefone', form), function(v){ v=v.replace(/\D/g,'').slice(0,11); if(v.length>6) return v.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3'); if(v.length>2) return v.replace(/(\d{2})(\d{0,5})/,'($1) $2'); return v; });
    setInputFilter(cep, function(v){ if(!v) return ''; v=v.replace(/\D/g,'').slice(0,8); if(v.length>5) return v.replace(/(\d{5})(\d{0,3})/,'$1-$2'); return v; });

    // ViaCEP lookup
    cep?.addEventListener('blur', function(){
      const raw = (this.value || '').replace(/\D/g,'');
      if(raw.length !== 8) return;
      fetch('https://viacep.com.br/ws/'+raw+'/json/')
        .then(function(res){ if(!res.ok) throw new Error('network'); return res.json(); })
        .then(function(data){
          if(data.erro){ showToast('CEP não encontrado'); return; }
          if(endereco) endereco.value = data.logradouro || endereco.value;
          if(cidade) cidade.value = data.localidade || cidade.value;
          if(estado) estado.value = data.uf || estado.value;
          showToast('Endereço preenchido pelo CEP');
        }).catch(function(){ showToast('Erro ao consultar CEP'); });
    });

    // submit
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.checkValidity()){
        const firstInvalid = qs(':invalid', form);
        firstInvalid?.focus();
        showToast('Por favor, corrija os campos inválidos');
        return;
      }
      // confirmar envio
      showConfirm('Deseja enviar o cadastro?').then(function(ok){
        if(!ok){ showToast('Envio cancelado'); return; }
        // simular envio
        showToast('Enviando cadastro...');
        setTimeout(function(){ showToast('Cadastro enviado com sucesso!'); form.reset(); }, 1200);
      });
    });
  })();

});
