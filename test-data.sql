-- Clave y pin = blake2s("1234")
INSERT INTO Usuario(id, nombre, clave, pin, perfil) VALUES
    (1, 'marco', 
    '90931556d9513e8c26040a9ec2a2f1300bdc79a890907da9cc2b3a2c690574c1',
    '90931556d9513e8c26040a9ec2a2f1300bdc79a890907da9cc2b3a2c690574c1',
    10),
    (2, 'cris', 
    '90931556d9513e8c26040a9ec2a2f1300bdc79a890907da9cc2b3a2c690574c1',
    '90931556d9513e8c26040a9ec2a2f1300bdc79a890907da9cc2b3a2c690574c1',
    10),
    (3, 'gerard', 
    '90931556d9513e8c26040a9ec2a2f1300bdc79a890907da9cc2b3a2c690574c1',
    '90931556d9513e8c26040a9ec2a2f1300bdc79a890907da9cc2b3a2c690574c1',
    10)
;

INSERT INTO Usuario_sigue(id, seguido) VALUES
    (1, 2),
    (2, 1),
    (3, 1),
    (3, 2)
;

SET @test_details = '{ "Tipo de final": "Murio por caida"}';

INSERT INTO Calificacion(
    semilla, version_juego, fecha, puntuacion,
    tiempo_ms, detalles, usuario
) VALUES
    (42, 1, '2023-08-04', 50000, 60000, @test_details, 1),
    (42, 1, '2023-08-04', 102000, 300000, @test_details, 1),
    (42, 1, '2023-08-04', 500, 3000, @test_details, 1),
    (42, 1, '2023-08-04', 256000, 403044, @test_details, 3),
    (42, 1, '2023-08-04', 69420, 4301048, @test_details, 2),
    (42, 1, '2023-08-04', 1000000, 2394023, @test_details, 2),
    (42, 1, '2023-08-04', 394000, 101 * 60 * 60 * 1000, @test_details, 1)

;