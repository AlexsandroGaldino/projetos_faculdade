// app.js — funcionalidades avançadas para a plataforma ONG
// Implementações: menu hambúrguer acessível, smooth scroll, filtro de projetos,
// máscaras para CPF/telefone/CEP, lookup ViaCEP, modal de confirmação e toasts.

(function (){
  'use strict';
  console.log('app.js carregado');

  function qs(sel, ctx){ return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx){ return Array.from((ctx || document).querySelectorAll(sel)); }

  document.addEventListener('DOMContentLoaded', function(){
    // -------------------- Menu hambúrguer acessível --------------------
    (function setupHamburger(){
      var nav = qs('.main-nav');
      if(!nav) return;
      var navList = qs('.main-nav ul');
      if(!navList) return;

      var hamburger = qs('.hamburger');
      var headerContainer = qs('.site-header .container') || qs('.container');

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
        var open = navList.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });
      navList.addEventListener('click', function(e){ if(e.target && e.target.tagName === 'A') closeMenu(); });
    })();

    // -------------------- Smooth scroll para âncoras --------------------
    try{
      qsa('a[href^="#"]').forEach(function(a){
        a.addEventListener('click', function(e){
          var href = a.getAttribute('href');
          if(href && href.length > 1){
            var target = document.querySelector(href);
            if(target){
              e.preventDefault();
              target.scrollIntoView({behavior:'smooth', block:'start'});
              try{ target.focus({preventScroll:true}); }catch(err){}
            }
          }
        });
      });
    }catch(e){ /* não crítico */ }

    // -------------------- Filtro dinâmico de projetos --------------------
    (function setupProjectsFilter(){
      var filtersForm = qs('.filters');
      if(!filtersForm) return;
      var busca = qs('#busca', filtersForm);
      var categoria = qs('#categoria', filtersForm);
      var projects = qsa('.projects-list .project-card');
      if(projects.length === 0) return;

      projects.forEach(function(p){
        if(!p.dataset.category){
          var t = (qs('h3', p) && qs('h3', p).textContent || '').toLowerCase();
          var d = (qs('p', p) && qs('p', p).textContent || '').toLowerCase();
          if(t.indexOf('capacit') !== -1 || d.indexOf('capacita') !== -1) p.dataset.category = 'educacao';
          else if(t.indexOf('clínic') !== -1 || t.indexOf('clinica') !== -1 || d.indexOf('saúde') !== -1 || d.indexOf('saude') !== -1) p.dataset.category = 'saude';
          else p.dataset.category = 'outros';
        }
      });

      function applyFilter(){
        var q = (busca && busca.value || '').trim().toLowerCase();
        var cat = (categoria && categoria.value) || 'todas';
        projects.forEach(function(p){
          var title = (qs('h3', p) && qs('h3', p).textContent || '').toLowerCase();
          var desc = (qs('p', p) && qs('p', p).textContent || '').toLowerCase();
          var matchesQ = q === '' || title.indexOf(q) !== -1 || desc.indexOf(q) !== -1;
          var matchesCat = cat === 'todas' || (p.dataset.category && p.dataset.category === cat);
          p.style.display = (matchesQ && matchesCat) ? '' : 'none';
        });
      }

      if(busca) busca.addEventListener('input', applyFilter);
      if(categoria) categoria.addEventListener('change', applyFilter);
    })();

    // -------------------- UI: Toasts e Modal simples --------------------
    function showToast(message, time){
      time = time || 3000;
      var toast = document.createElement('div');
      toast.className = 'app-toast';
      toast.textContent = message;
      toast.style.cssText = 'position:fixed;right:16px;bottom:16px;background:#222;color:#fff;padding:10px 14px;border-radius:8px;z-index:9999;box-shadow:0 6px 18px rgba(0,0,0,0.12)';
      document.body.appendChild(toast);
      setTimeout(function(){ try{ toast.remove(); }catch(e){} }, time);
    }

    function showConfirm(message){
      return new Promise(function(resolve){
        var modal = document.createElement('div');
        modal.className = 'app-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9998';
        var content = document.createElement('div');
        content.style.cssText = 'background:#fff;padding:20px;border-radius:10px;max-width:480px;width:90%;box-shadow:0 10px 30px rgba(0,0,0,0.12)';
        content.innerHTML = '<p style="margin:0 0 12px">'+message+'</p>' +
          '<div style="display:flex;gap:8px;justify-content:flex-end">' +
          '<button class="btn btn-primary" id="confirm-ok">Confirmar</button>' +
          '<button class="btn btn-secondary" id="confirm-cancel">Cancelar</button>' +
          '</div>';
        modal.appendChild(content);
        document.body.appendChild(modal);

        qs('#confirm-ok', modal).addEventListener('click', function(){ try{ modal.remove(); }catch(e){}; resolve(true); });
        qs('#confirm-cancel', modal).addEventListener('click', function(){ try{ modal.remove(); }catch(e){}; resolve(false); });

        function onKey(e){ if(e.key === 'Escape'){ try{ modal.remove(); }catch(err){}; resolve(false); document.removeEventListener('keydown', onKey); } }
        document.addEventListener('keydown', onKey);
      });
    }

    // -------------------- Formulário: máscaras, ViaCEP e envio simulado --------------------
    (function setupForm(){
      var form = qs('#formCadastro');
      if(!form) return;
      var cep = qs('#cep', form);
      var endereco = qs('#endereco', form);
      var cidade = qs('#cidade', form);
      var estado = qs('#estado', form);

      function setInputFilter(el, func){ if(!el) return; el.addEventListener('input', function(){ this.value = func(this.value); }); }

      setInputFilter(qs('#cpf', form), function(v){ v = (v || '').replace(/\D/g,'').slice(0,11); if(v.length>9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/,'$1.$2.$3-$4'); if(v.length>6) return v.replace(/(\d{3})(\d{3})(\d{0,3})/,'$1.$2.$3'); if(v.length>3) return v.replace(/(\d{3})(\d{0,3})/,'$1.$2'); return v; });
      setInputFilter(qs('#telefone', form), function(v){ v = (v || '').replace(/\D/g,'').slice(0,11); if(v.length>6) return v.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3'); if(v.length>2) return v.replace(/(\d{2})(\d{0,5})/,'($1) $2'); return v; });
      setInputFilter(cep, function(v){ v = (v || '').replace(/\D/g,'').slice(0,8); if(v.length>5) return v.replace(/(\d{5})(\d{0,3})/,'$1-$2'); return v; });

      cep && cep.addEventListener('blur', function(){
        var raw = (this.value || '').replace(/\D/g,'');
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

      form.addEventListener('submit', function(e){
        e.preventDefault();
        if(!form.checkValidity()){
          var firstInvalid = qs(':invalid', form);
          firstInvalid && firstInvalid.focus();
          showToast('Por favor, corrija os campos inválidos');
          return;
        }
        showConfirm('Deseja enviar o cadastro?').then(function(ok){
          if(!ok){ showToast('Envio cancelado'); return; }
          showToast('Enviando cadastro...');
          setTimeout(function(){ showToast('Cadastro enviado com sucesso!'); form.reset(); }, 1200);
        });
      });
    })();

  }); // DOMContentLoaded
})();
