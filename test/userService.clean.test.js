const { UserService } = require ('../src/userService');

describe('UserService - Suíte de Testes com Smells', () => {
  let userService;

  // O setup é executado antes de cada teste
  beforeEach(() => {
    userService = new UserService();
  });

  test('cria user com status ativo', () => {

    const dadosUsuarioPadrao = {
      nome: 'Fulano de Tal',
      email: 'fulano@teste.com',
      idade: 25,
    };

    const usuario = userService.createUser(dadosUsuarioPadrao.nome, dadosUsuarioPadrao.email, dadosUsuarioPadrao.idade);

    expect(usuario).toEqual(expect.objectContaining({
      id: expect.any(String),
      nome: dadosUsuarioPadrao.nome,
      email: dadosUsuarioPadrao.email,
      status: 'ativo',
    }));
  });

  test('busca usuário por id após criação', () => {
    const novo = userService.createUser('Fulano', 'f@t.com', 25);

    const buscado = userService.getUserById(novo.id);

    expect(buscado).toEqual(
      expect.objectContaining({
        id: novo.id,
        nome: 'Fulano',
        status: 'ativo',
      })
    );
  });

  test('desativa usuário se não for administrador', () => {
    const comum = userService.createUser('Comum', 'c@t.com', 30, false);

    const ok = userService.deactivateUser(comum.id);

    expect(ok).toBe(true);
    expect(userService.getUserById(comum.id).status).toBe('inativo');
  });

  test('não desativa administrador', () => {
    const admin = userService.createUser('Admin', 'a@t.com', 40, true);

    const ok = userService.deactivateUser(admin.id);

    expect(ok).toBe(false);
    expect(userService.getUserById(admin.id).status).toBe('ativo');
  });

  test('lança erro ao criar usuário menor de idade', () => {
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idade = 17;

    expect(() => userService.createUser(nome, email, idade))
      .toThrow('O usuário deve ser maior de idade.');
  });
  test('gera relatório com cabeçalho e inclui usuário criado (sem depender de formatação exata)', () => {

    const u1 = userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    const relatorio = userService.generateUserReport();

    expect(relatorio.startsWith('--- Relatório de Usuários ---')).toBe(true);

    const contemAlice = new RegExp(`ID:\\s*${u1.id}.*Nome:\\s*Alice.*Status:\\s*ativo`, 'i');
    expect(relatorio).toMatch(contemAlice);
  });

});

  